import { LoupGarouAngularPage } from './app.po';

describe('loup-garou-angular App', () => {
  let page: LoupGarouAngularPage;

  beforeEach(() => {
    page = new LoupGarouAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
