export class FileUpload {
  id: number;
  key!: string;
  name!: string;
  url!: string;
  file: File;
  // uuid: string;

  constructor(file: File) {
    this.file = file;
  }
}
