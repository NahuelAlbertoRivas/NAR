export class CreateProjectDto {
  title!: string;
  slug!: string;
  shortDescription!: string;
  published?: boolean;
  videoUrl?: string;
}

export class UpdateProjectDto {
  title?: string;
  slug?: string;
  shortDescription?: string;
  published?: boolean;
  videoUrl?: string;
}
