export abstract class Presenter<TDomain, TPresentation> {
  protected abstract toPresentation(domainObject: TDomain): TPresentation;
}
