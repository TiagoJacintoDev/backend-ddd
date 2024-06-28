export abstract class PresentationMapper<TDomain, TPresentation> {
  protected abstract toPresentation(domainObject: TDomain): TPresentation;
}
