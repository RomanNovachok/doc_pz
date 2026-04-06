import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TemporaryFileStorage } from '../../business/interfaces/temporary-file-storage.interface';
import { TEMPORARY_FILE_STORAGE } from '../../business/interfaces/tokens';
import { AmazonMarketplaceImportService } from '../../business/services/amazon-marketplace-import.service';
import { AmazonMarketplaceQueryService } from '../../business/services/amazon-marketplace-query.service';
import { LoadImportDto } from '../dto/load-import.dto';

@ApiTags('imports')
@Controller('imports')
export class ImportsController {
  constructor(
    private readonly importService: AmazonMarketplaceImportService,
    private readonly queryService: AmazonMarketplaceQueryService,
    @Inject(TEMPORARY_FILE_STORAGE) private readonly temporaryFileStorage: TemporaryFileStorage,
  ) {}

  @Post('load')
  @ApiOperation({ summary: 'Import data from a CSV file path on the server' })
  @ApiOkResponse({ description: 'Import summary' })
  loadFromPath(@Body() body: LoadImportDto) {
    return this.importService.importFromFile(body.csvPath);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload CSV and import it into the SQLite database' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  async uploadAndImport(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('CSV file is required.');
    }

    const storedPath = await this.temporaryFileStorage.save(file.originalname, file.buffer);

    try {
      return await this.importService.importFromFile(storedPath);
    } finally {
      await this.temporaryFileStorage.remove(storedPath);
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get current statistics from all tables' })
  getStats() {
    return this.queryService.getStats();
  }
}
