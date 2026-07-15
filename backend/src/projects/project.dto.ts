export class CreateProjectDto {
  title!: string;
  slug!: string;
  shortDescription!: string;
  published?: boolean;
}

export class UpdateProjectDto {
  title?: string;
  slug?: string;
  shortDescription?: string;
  published?: boolean;
}
