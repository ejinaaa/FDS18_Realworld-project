const editSkeleton = () => `<div class="editor-page">
<div class="container page">
  <div class="row">

    <div class="col-md-10 offset-md-1 col-xs-12">
      <form>
        <fieldset class="edit-skeleton-container">
          <fieldset class="form-group title-container">
            <input type="text" class="article-title form-control form-control-lg">
            <span class="edit-skeleton"></span>
          </fieldset>
          <fieldset class="form-group description-container">
            <input type="text" class="article-description form-control">
            <span class="edit-skeleton"></span>
          </fieldset>
          <fieldset class="form-group textarea-container">
            <textarea class="article-body form-control" rows="8"></textarea>
            <span class="edit-skeleton"></span>
            <span class="edit-skeleton"></span>
            <span class="edit-skeleton"></span>
            <span class="edit-skeleton"></span>
            <span class="edit-skeleton"></span>
            <span class="edit-skeleton short-skeleton"></span>
        </fieldset>
        <fieldset class="form-group tag-container">
          <input type="text" class="article-tag-list form-control"><div class="tag-list"></div>
          <span class="edit-skeleton skeleton-tag"></span>
        </fieldset>
        <button class="btn btn-lg btn-publish pull-xs-right btn-primary" type="button">
          Publish Article
        </button>
        </fieldset>
      </form>
    </div>

  </div>
</div>
</div>`;

export default editSkeleton;