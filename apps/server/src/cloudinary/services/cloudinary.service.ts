import { Injectable, Logger } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly uploadTimeout = 30000; // 30 seconds timeout

  constructor(private configService: ConfigService) {
    // Ensure Cloudinary is configured on service initialization
    this.configureCloudinary();
  }

  private configureCloudinary() {
    const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.warn(
        'Incomplete Cloudinary configuration. Some features may not work properly.',
      );
    }

    v2.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        reject(new Error('Upload timeout after 30 seconds'));
      }, this.uploadTimeout);

      const upload = v2.uploader.upload_stream(
        { folder: 'nevo commerce', resource_type: 'auto' },
        (error, result) => {
          clearTimeout(timeout);

          if (error) {
            this.logger.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(result as any);
        },
      );

      const stream = Readable.from(file.buffer);
      stream.pipe(upload);
    });
  }

  async uploadImages(images: string[]): Promise<string[]> {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return [];
    }

    this.logger.log(
      `Attempting to upload ${images.length} images to Cloudinary`,
    );

    const validUrls = images.filter(
      url => typeof url === 'string' && url.startsWith('http'),
    );
    if (validUrls.length === 0) {
      this.logger.warn('No valid image URLs to upload');
      return [];
    }

    const uploadPromises = validUrls.map(async (imageUrl, index) => {
      try {
        this.logger.debug(
          `Fetching image ${index + 1}/${validUrls.length} from URL: ${imageUrl}`,
        );

        // Use AbortController for implementing timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.uploadTimeout,
        );

        let imageBuffer: Buffer;
        try {
          const response = await fetch(imageUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(
              `Failed to fetch image: ${response.status} ${response.statusText}`,
            );
          }

          imageBuffer = Buffer.from(await response.arrayBuffer());
          clearTimeout(timeoutId); // Clear the timeout as fetch completed successfully
        } catch (fetchError: unknown) {
          clearTimeout(timeoutId);
          // Type guard for the error object
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            throw new Error(`Fetch timeout after ${this.uploadTimeout}ms`);
          }
          throw fetchError;
        }

        return new Promise<string>((resolve, reject) => {
          // Set a timeout to prevent hanging
          const timeout = setTimeout(() => {
            reject(
              new Error(
                `Upload timeout for image ${index + 1} after 30 seconds`,
              ),
            );
          }, this.uploadTimeout);

          const timestamp = Math.floor(Date.now() / 1000);
          const upload = v2.uploader.upload_stream(
            {
              folder: 'products',
              timestamp,
              resource_type: 'auto',
            },
            (error, result) => {
              clearTimeout(timeout);

              if (error) {
                this.logger.error(
                  `Cloudinary upload error for image ${index + 1}:`,
                  error,
                );
                return reject(error);
              }

              this.logger.log(
                `Successfully uploaded image ${index + 1} to Cloudinary`,
              );
              resolve(result?.secure_url || '');
            },
          );

          const stream = Readable.from(imageBuffer);
          stream.pipe(upload);
        });
      } catch (error) {
        this.logger.error(`Error processing image ${index + 1}:`, error);
        return ''; // Return empty string for failed uploads
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      // Filter out empty strings (failed uploads)
      return results.filter(url => url);
    } catch (error) {
      this.logger.error('Error during batch image upload:', error);
      return [];
    }
  }

  async uploadBuffer(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        reject(new Error('Upload timeout after 30 seconds'));
      }, this.uploadTimeout);

      const timestamp = Math.floor(Date.now() / 1000);
      const upload = v2.uploader.upload_stream(
        {
          folder: 'products',
          timestamp,
          resource_type: 'auto',
        },
        (error, result) => {
          clearTimeout(timeout);

          if (error) {
            this.logger.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(result?.secure_url || '');
        },
      );

      const stream = Readable.from(buffer);
      stream.pipe(upload);
    });
  }
}
