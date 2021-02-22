abstract class View {
  // eslint-disable-next-line class-methods-use-this
  setTitle(title: string): void {
    document.title = `Conduit-${title}`;
  }

  abstract getHtml(): Promise<string>;
}

export default View;
