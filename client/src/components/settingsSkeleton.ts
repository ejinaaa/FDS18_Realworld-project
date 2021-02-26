const settingsSkeleton = () => `<div class="settings-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>
        <form>
        <fieldset class="settings-skeleton-container">
        <fieldset class="form-group img-url-container">
          <input class="form-control setting-input-img-url" type="text" placeholder="URL of profile picture">
          <span class="settings-skeleton skeleton-img-url"></span>
          </fieldset>
            <fieldset class="form-group name-container">
              <input class="form-control form-control-lg setting-input-name" type="text" placeholder="Your Name"disabled>
              <span class="settings-skeleton skeleton-name"></span>
            </fieldset>
            <fieldset class="form-group textarea-container">
              <textarea class="form-control form-control-lg setting-input-bio" rows="8" placeholder="Short bio about you">
              </textarea>
              <span class="settings-skeleton skeleton-textarea"></span>
              <span class="settings-skeleton skeleton-textarea"></span>
              <span class="settings-skeleton skeleton-textarea"></span>
              <span class="settings-skeleton skeleton-textarea"></span>
              <span class="settings-skeleton skeleton-textarea"></span>
              <span class="settings-skeleton skeleton-textarea"></span>
              <span class="settings-skeleton skeleton-textarea"></span>
              <span class="settings-skeleton skeleton-textarea"></span>
            </fieldset>
            <fieldset class="form-group email-container">
              <input class="form-control form-control-lg setting-input-email" type="text" placeholder="Email">
              <span class="settings-skeleton skeleton-email"></span>
            </fieldset>
            <fieldset class="form-group pw-container">
              <input class="form-control form-control-lg setting-input-pw" type="password" placeholder="Password">
              <span class="settings-skeleton skeleton-pw"></span>
          </fieldset>
        </fieldset>
        <button class="btn btn-lg btn-primary pull-xs-right setting-btn">
            Update Settings
        </button>
        </form>
      </div>
    </div>
  </div>`;

export default settingsSkeleton;