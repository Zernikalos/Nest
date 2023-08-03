
export class Constants {

    public static get isMac(): boolean {
        return process.platform === 'darwin'
    }
}