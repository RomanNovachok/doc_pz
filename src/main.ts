import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(join(process.cwd(), 'src', 'presentation', 'views'));
  app.setViewEngine('hbs');

  const config = new DocumentBuilder()
    .setTitle('Amazon Marketplace Labs')
    .setDescription('Lab 2 REST API and Lab 3 MVC application')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`Server started on http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/docs`);
  console.log(`MVC UI: http://localhost:${port}/products`);
}

void bootstrap();