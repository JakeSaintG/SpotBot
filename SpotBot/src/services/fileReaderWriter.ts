class FileReaderWriter {
    private fileName: string

    public constructor(name: string) {
        this.fileName = name
    }

    public getFIleName(): string {
        return this.fileName
    }
}
