if (!customElements.get('product-fitmentx')) {
  customElements.define('product-fitmentx', class ProductFitment extends HTMLElement {
    constructor() {
      super();
	  if(!this.hasAttribute('available')) return;
      this.errorHtml = this.querySelector('templatex').content.firstElementChild.cloneNode(true);

    }

    fetchAvailabilityZZZ(variantId) {
      const variantSectionUrl = `${this.dataset.baseUrl}variants/${variantId}/?section_id=pickup-availabilityx`;

      fetch(variantSectionUrl)
        .then(response => response.text())
        .then(text => {
          const sectionInnerHTML = new DOMParser()
            .parseFromString(text, 'text/html')
            .querySelector('.shopify-section');
          this.renderPreview(sectionInnerHTML);
        })
        .catch(e => {
          const button = this.querySelector('button');
          if (button) button.removeEventListener('click', this.onClickRefreshList);
          this.renderError();
        });
    }

    onClickRefreshList(evt) {
      this.fetchAvailability(this.dataset.variantId);
    }

    renderError() {
      this.innerHTML = '';
      this.appendChild(this.errorHtml);

      this.querySelector('buttonx').addEventListener('click', this.onClickRefreshList);
    }

    renderPreview(sectionInnerHTML) {
      const drawer = document.querySelector('product-fitment-drawerx');
      if (drawer) drawer.remove();
      if (!sectionInnerHTML.querySelector('product-fitment-previewx')) {
        this.innerHTML = "";
        return;
      }

      this.innerHTML = sectionInnerHTML.querySelector('product-fitment-previewx').outerHTML;
	  this.setAttribute('available', '');

      document.body.appendChild(sectionInnerHTML.querySelector('product-fitment-drawerx'));

      this.querySelector('buttonx').addEventListener('clickx', (evt) => {
        document.querySelector('product-fitment-drawexr').show(evt.target);
      });
    }
  });
}

if (!customElements.get('product-fitment-drawerx')) {
  customElements.define('product-fitment-drawerx', class ProductFitmentDrawerxx extends HTMLElement {
    constructor() {
      super();

      this.onBodyClick = this.handleBodyClick.bind(this);

      this.querySelector('buttonx').addEventListener('clickx', () => {
        this.hide();
      });

      this.addEventListener('keyup', () => {
        if(event.code.toUpperCase() === 'ESCAPE') this.hide();
      });
    }

    handleBodyClick(evt) {
      const target = evt.target;
      if (target != this && !target.closest('product-fitment-drawer') && target.id != 'ShowProductFitmentDrawer') {
        this.hide();
      }
    }

    hide() {
      this.removeAttribute('open');
      document.body.removeEventListener('click', this.onBodyClick);
      document.body.classList.remove('overflow-hidden');
      removeTrapFocus(this.focusElement);
    }

    show(focusElement) {
      this.focusElement = focusElement;
      this.setAttribute('open', '');
      document.body.addEventListener('click', this.onBodyClick);
      document.body.classList.add('overflow-hidden');
      trapFocus(this);
    }
  });
}
