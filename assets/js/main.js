document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. DARK / LIGHT MODE TOGGLE (DENGAN PENYIMPANAN LOCALSTORAGE)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const lightIcon = document.getElementById('theme-toggle-light-icon');
  const darkIcon = document.getElementById('theme-toggle-dark-icon');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('color-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    htmlElement.classList.add('dark');
    if (lightIcon) lightIcon.classList.remove('hidden');
  } else {
    htmlElement.classList.remove('dark');
    if (darkIcon) darkIcon.classList.remove('hidden');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (lightIcon) lightIcon.classList.toggle('hidden');
      if (darkIcon) darkIcon.classList.toggle('hidden');

      if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        htmlElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    });
  }

  /* ==========================================================================
     2. MENU NAVIGASI MOBILE (AUTO-CLOSE SAAT KLIK LINK ATAU LUAR MENU)
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });

    // Tutup menu otomatis saat pengguna memilih salah satu bagian
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });

    // Tutup menu otomatis saat menyentuh area di luar dropdown
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  }

  /* ==========================================================================
     3. NAVBAR CERDAS (AUTO-HIDE SAAT SCROLL & PENGUNCI SAAT KLIK MENU)
     ========================================================================== */
  const header = document.getElementById('main-header');
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  const scrollDelta = 8;
  let isScrollingFromClick = false;
  let scrollTimeout;

  // Kunci navbar agar tetap tampil saat pengguna mengklik tautan navigasi
  const navAnchorLinks = document.querySelectorAll('header a[href^="#"]');
  navAnchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', () => {
      isScrollingFromClick = true;
      if (header) header.style.transform = 'translateY(0)';
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingFromClick = false;
        lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
      }, 800);
    });
  });

  window.addEventListener('scroll', () => {
    if (isScrollingFromClick) return;

    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Jangan sembunyikan navbar jika menu mobile sedang dibuka pengguna
    const isMobileMenuOpen = mobileMenu && !mobileMenu.classList.contains('hidden');
    if (isMobileMenuOpen) {
      if (header) header.style.transform = 'translateY(0)';
      lastScrollY = currentScrollY;
      return;
    }

    // Selalu tampilkan navbar di dekat puncak halaman
    if (currentScrollY <= 40) {
      if (header) header.style.transform = 'translateY(0)';
      lastScrollY = currentScrollY;
      return;
    }

    // Cek apakah perpindahan melebihi ambang batas delta
    if (Math.abs(currentScrollY - lastScrollY) < scrollDelta) {
      return;
    }

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      // Pengguna scroll ke bawah -> sembunyikan navbar ke atas layar
      if (header) header.style.transform = 'translateY(-100%)';
    } else if (currentScrollY < lastScrollY) {
      // Pengguna scroll ke atas -> munculkan kembali navbar
      if (header) header.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  }, { passive: true });

  /* ==========================================================================
     4. TRANSISI TOMBOL "HUBUNGI SAYA" DI NAVBAR (KONDISI 1 VS KONDISI 2)
     ========================================================================== */
  const heroContactBtn = document.getElementById('hero-contact-btn');
  const navContactBtn = document.getElementById('nav-contact-btn');

  if (heroContactBtn && navContactBtn) {
    const showNavContact = () => {
      navContactBtn.classList.remove('max-w-0', 'opacity-0', 'pointer-events-none', 'ml-0', 'px-0');
      navContactBtn.classList.add('max-w-[140px]', 'opacity-100', 'pointer-events-auto', 'ml-2.5', 'px-3.5');
    };

    const hideNavContact = () => {
      navContactBtn.classList.add('max-w-0', 'opacity-0', 'pointer-events-none', 'ml-0', 'px-0');
      navContactBtn.classList.remove('max-w-[140px]', 'opacity-100', 'pointer-events-auto', 'ml-2.5', 'px-3.5');
    };

    const contactObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Kondisi 2: Tombol di Hero sudah terlewati ke atas layar
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            showNavContact();
          } else {
            // Kondisi 1: Pengguna masih berada di area atas / tombol Hero terlihat
            hideNavContact();
          }
        });
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '-64px 0px 0px 0px' // Menyesuaikan tinggi sticky navbar (h-16 / 64px)
      }
    );

    contactObserver.observe(heroContactBtn);
  }

  /* ==========================================================================
     5. LIGHTBOX MODAL (GAMBAR TUNGGAL, SLIDER KURSUS & STUDI KASUS PROYEK)
     ========================================================================== */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxCounter = document.getElementById('lightbox-counter');

  // Elemen Mode 1: Gambar & Slider Sertifikat
  const lightboxImageContainer = document.getElementById('lightbox-image-Container');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // Elemen Mode 2: Detail Studi Kasus Proyek
  const lightboxProjectCard = document.getElementById('lightbox-project-card');
  const projectModalImg = document.getElementById('project-modal-img');
  const projectModalImgFallback = document.getElementById('project-modal-img-fallback');
  const projectModalTags = document.getElementById('project-modal-tags');
  const projectModalPeriod = document.getElementById('project-modal-period');
  const projectModalCategory = document.getElementById('project-modal-category');
  const projectModalTitle = document.getElementById('project-modal-title');
  const projectModalProblem = document.getElementById('project-modal-problem');
  const projectModalSolution = document.getElementById('project-modal-solution');
  const projectModalResult = document.getElementById('project-modal-result');

  const singleTriggers = document.querySelectorAll('.lightbox-trigger');
  const galleryTriggers = document.querySelectorAll('.lightbox-gallery-trigger');
  const projectTriggers = document.querySelectorAll('.project-modal-trigger');

  let currentGallery = [];
  let currentIndex = 0;

  const renderLightboxSlide = () => {
    if (!lightboxModal || !lightboxImg || currentGallery.length === 0) return;

    // Pastikan Mode Gambar tampil dan Mode Proyek disembunyikan
    if (lightboxProjectCard) lightboxProjectCard.classList.add('hidden');
    if (lightboxImageContainer) lightboxImageContainer.classList.remove('hidden');

    const currentItem = currentGallery[currentIndex];
    const totalItems = currentGallery.length;

    if (totalItems > 1) {
      if (lightboxPrev) lightboxPrev.classList.remove('hidden');
      if (lightboxNext) lightboxNext.classList.remove('hidden');
      if (lightboxCounter) {
        lightboxCounter.textContent = `Sertifikat ${currentIndex + 1} / ${totalItems}`;
        lightboxCounter.classList.remove('hidden');
      }
    } else {
      if (lightboxPrev) lightboxPrev.classList.add('hidden');
      if (lightboxNext) lightboxNext.classList.add('hidden');
      if (lightboxCounter) lightboxCounter.classList.add('hidden');
    }

    lightboxImg.classList.remove('hidden');
    if (lightboxCaption) {
      lightboxCaption.textContent = currentItem.caption || '';
    }

    lightboxImg.onerror = () => {
      lightboxImg.classList.add('hidden');
      if (lightboxCaption) {
        lightboxCaption.innerHTML = `
          <span class="block text-amber-400 font-semibold mb-1">Berkas gambar belum tersedia di folder:</span>
          <code class="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs">${currentItem.src}</code>
          <span class="block mt-2 text-slate-300 font-semibold">${currentItem.caption || ''}</span>
        `;
      }
    };

    lightboxImg.src = currentItem.src;
  };

  const openLightboxGallery = (items, startIndex = 0) => {
    if (!lightboxModal || !items || items.length === 0) return;
    currentGallery = items;
    currentIndex = startIndex;
    renderLightboxSlide();
    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  // Fungsi Pembuka Mode 2: Studi Kasus Proyek Teknis
  const openProjectModal = (triggerEl) => {
    if (!lightboxModal || !lightboxProjectCard) return;

    currentGallery = [];
    if (lightboxImageContainer) lightboxImageContainer.classList.add('hidden');
    if (lightboxCounter) lightboxCounter.classList.add('hidden');
    lightboxProjectCard.classList.remove('hidden');

    const imgSrc = triggerEl.getAttribute('data-img') || '';
    const period = triggerEl.getAttribute('data-period') || '';
    const category = triggerEl.getAttribute('data-category') || '';
    const title = triggerEl.getAttribute('data-title') || '';
    const tagsRaw = triggerEl.getAttribute('data-tags') || '';
    const problem = triggerEl.getAttribute('data-problem') || '';
    const solution = triggerEl.getAttribute('data-solution') || '';
    const result = triggerEl.getAttribute('data-result') || '';

    if (projectModalPeriod) projectModalPeriod.textContent = period;
    if (projectModalCategory) projectModalCategory.textContent = category;
    if (projectModalTitle) projectModalTitle.textContent = title;
    if (projectModalProblem) projectModalProblem.textContent = problem;
    if (projectModalSolution) projectModalSolution.textContent = solution;
    if (projectModalResult) projectModalResult.textContent = result;

    if (projectModalTags) {
      projectModalTags.innerHTML = '';
      tagsRaw.split(',').forEach((tag) => {
        const cleanTag = tag.trim();
        if (cleanTag) {
          const span = document.createElement('span');
          span.className = 'skill-tag';
          span.textContent = cleanTag;
          projectModalTags.appendChild(span);
        }
      });
    }

    if (projectModalImg) {
      projectModalImg.classList.remove('hidden');
      if (projectModalImgFallback) projectModalImgFallback.classList.add('hidden');

      projectModalImg.onerror = () => {
        projectModalImg.classList.add('hidden');
        if (projectModalImgFallback) {
          projectModalImgFallback.classList.remove('hidden');
          projectModalImgFallback.innerHTML = `
            <span class="block text-amber-500 dark:text-amber-400 font-semibold mb-1">Visual proyek belum tersedia:</span>
            <code class="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[11px] break-all">${imgSrc}</code>
          `;
        }
      };

      projectModalImg.src = imgSrc;
    }

    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.add('hidden');
    lightboxModal.classList.remove('flex');

    if (lightboxImg) {
      lightboxImg.onerror = null;
      lightboxImg.removeAttribute('src');
    }
    if (projectModalImg) {
      projectModalImg.onerror = null;
      projectModalImg.removeAttribute('src');
    }

    currentGallery = [];
    currentIndex = 0;
    document.body.style.overflow = '';
  };

  const showPrevSlide = (e) => {
    if (e) e.stopPropagation();
    if (currentGallery.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    renderLightboxSlide();
  };

  const showNextSlide = (e) => {
    if (e) e.stopPropagation();
    if (currentGallery.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentGallery.length;
    renderLightboxSlide();
  };

  // Trigger untuk gambar tunggal (Pengalaman, Sertifikasi Utama, Prestasi, Organisasi)
  singleTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('data-lightbox');
      const captionText = trigger.getAttribute('data-caption');
      if (imgSrc) {
        openLightboxGallery([{ src: imgSrc, caption: captionText }], 0);
      }
    });
  });

  // Trigger untuk 6 Keping Klaster Kursus (Multi-Slide — Bisa Di-disable via data-gallery-disabled="true")
  galleryTriggers.forEach((trigger) => {
    if (trigger.getAttribute('data-gallery-disabled') === 'true') return;

    trigger.classList.add('cursor-pointer');
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const rawGallery = trigger.getAttribute('data-gallery');
      if (!rawGallery) return;
      try {
        const parsedGallery = JSON.parse(rawGallery);
        if (Array.isArray(parsedGallery) && parsedGallery.length > 0) {
          openLightboxGallery(parsedGallery, 0);
        }
      } catch (err) {
        console.error('Format data-gallery tidak valid:', err);
      }
    });
  });

  // Trigger untuk 6 Kartu Proyek Teknis (Studi Kasus Proyek)
  projectTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectModal(trigger);
    });
  });

  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevSlide);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextSlide);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || lightboxModal.classList.contains('hidden')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevSlide();
    } else if (e.key === 'ArrowRight') {
      showNextSlide();
    }
  });

  /* ==========================================================================
     6. PENANGANAN GAMBAR THUMBNAIL (TERMASUK YANG GAGAL SEBELUM SCRIPT JALAN)
     ========================================================================== */
  const cardImages = document.querySelectorAll('article img, #pengabdian img, #sertifikasi img');
  cardImages.forEach((img) => {
    const hideBrokenImg = () => {
      img.style.opacity = '0';
    };
    img.addEventListener('error', hideBrokenImg);
    if (img.complete && img.naturalWidth === 0) {
      hideBrokenImg();
    }
  });

  /* ==========================================================================
     7. FITUR SALIN EMAIL & NOMOR KE CLIPBOARD (ANTI-MACET SAAT KLIK CEPAT)
     ========================================================================== */
  const setupCopyBtn = (btnId, textToCopy) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    // Simpan teks asli di luar event click dan siapkan timer
    const originalHTML = btn.innerHTML;
    let copyTimeout;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(textToCopy).then(() => {
        clearTimeout(copyTimeout);
        btn.innerHTML = '<span>Tersalin!</span> ✓';
        btn.classList.add('text-emerald-500', 'font-semibold');
        copyTimeout = setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('text-emerald-500', 'font-semibold');
        }, 2000);
      }).catch((err) => {
        console.error('Gagal menyalin:', err);
      });
    });
  };

  setupCopyBtn('copy-email-btn', 'ahmadzq2004@gmail.com');
  setupCopyBtn('copy-phone-btn', '+6285848477782');
});
