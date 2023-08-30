class FileReaderWriter {
    private fileName: string

    public constructor(name: string) {
        this.fileName = name
    }

    public getFileName(): string {
        return this.fileName
    }
}
