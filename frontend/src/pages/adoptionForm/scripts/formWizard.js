document.addEventListener('DOMContentLoaded', () => {
  const steps = Array.from(document.querySelectorAll('.form-step'));
  let current = 0;

  function showStep(i) {
    steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
    updateNavButtons();
  }

    function updateNavButtons() {
    const stepEl = steps[current];

    // Gather all *visible* required fields
    const requiredFields = Array.from(
        stepEl.querySelectorAll('[required]')
    ).filter(el => el.offsetParent !== null);

    // Check validity
    const allValid = requiredFields.every(el => {
        if (el.type === 'checkbox') {
        return el.checked;
        }
        if (el.type === 'radio') {
        return Array.from(
            stepEl.querySelectorAll(`[name="${el.name}"]`)
        ).some(r => r.checked);
        }
        return el.value.trim() !== '';
    });

    // Toggle “Continue” button if present
    const nextBtn = stepEl.querySelector('.btn-next');
    if (nextBtn) nextBtn.disabled = !allValid;

    // Toggle “Submit” button on final step
    const submitBtn = stepEl.querySelector('.btn-submit');
    if (submitBtn) submitBtn.disabled = !allValid;
    }

  // toggle landlord section
  document.querySelectorAll('input[name="rentOrOwn"]').forEach(r => {
    r.addEventListener('change', () => {
      const L = document.querySelector('.landlord-info');
      const reqs = L.querySelectorAll('input');
      if (r.value === 'rent') {
        L.style.display = 'block';
        reqs.forEach(i => i.setAttribute('required', ''));
      } else {
        L.style.display = 'none';
        reqs.forEach(i => i.removeAttribute('required'));
      }
      updateNavButtons();
    });
  });

  // toggle other residents
  document.querySelectorAll('input[name="othersResiding"]').forEach(r => {
    r.addEventListener('change', () => {
      const R = document.querySelector('.residing-details');
      const inp = R.querySelector('input');
      if (r.value === 'yes') {
        R.style.display = 'block';
        inp.setAttribute('required', '');
      } else {
        R.style.display = 'none';
        inp.removeAttribute('required');
      }
      updateNavButtons();
    });
  });

  // toggle children section
  document.querySelectorAll('input[name="childrenLiving"]').forEach(r => {
    r.addEventListener('change', () => {
      const C = document.querySelector('.children-info');
      const elems = C.querySelectorAll('input');
      if (r.value === 'fullTime' || r.value === 'partTime') {
        C.style.display = 'block';
        elems.forEach(i => i.setAttribute('required', ''));
      } else {
        C.style.display = 'none';
        elems.forEach(i => i.removeAttribute('required'));
      }
      updateNavButtons();
    });
  });

  // setup navigation & validation hooks
  steps.forEach((step, idx) => {
    step.querySelectorAll('.btn-next').forEach(b =>
      b.addEventListener('click', () => { if (idx < steps.length - 1) { current = idx + 1; showStep(current); } })
    );
    step.querySelectorAll('.btn-back').forEach(b =>
      b.addEventListener('click', () => { if (idx > 0) { current = idx - 1; showStep(current); } })
    );
    // Include <select> so dropdowns trigger validation
    step.querySelectorAll('input, textarea, select').forEach(el =>
      el.addEventListener('change', updateNavButtons)
    );
  });

  showStep(0);
});