abstract class View {
  protected readonly USER_TOKEN: string | null = localStorage.getItem('JWT');

  setTitle(title: string): void {
    document.title = `Conduit-${title}`;
  }
  
  abstract skeleton(): string

  abstract getHtml(): Promise<string>

  abstract eventBinding(): void
}

export default View;
