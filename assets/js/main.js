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
      if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && e.target !== mobileMenuBtn) {
        mobileMenu.classList.add('hidden');
      }
    });
  }

    /* ==========================================================================
     NAVBAR CERDAS (AUTO-HIDE SAAT SCROLL KE BAWAH, MUNCUL SAAT SCROLL KE ATAS)
     ========================================================================== */
  const header = document.getElementById('main-header');
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  const scrollDelta = 8; // Ambang batas toleransi agar tidak flickering saat scroll halus

  window.addEventListener('scroll', () => {
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

  // Tampilkan navbar saat link anchor diklik
  const navAnchorLinks = document.querySelectorAll('header a[href^="#"]');
  navAnchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', () => {
      if (header) header.style.transform = 'translateY(0)';
    });
  });

  /* ==========================================================================
     3. LIGHTBOX MODAL DENGAN FALLBACK OTOMATIS JIKA FILE BELUM ADA
     ========================================================================== */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  const openLightbox = (imgSrc, captionText) => {
    if (!lightboxModal || !lightboxImg) return;

    // Reset tampilan gambar sebelum memuat file baru
    lightboxImg.classList.remove('hidden');
    lightboxImg.src = imgSrc;

    if (lightboxCaption) {
      lightboxCaption.textContent = captionText || '';
    }

    // Pengaman jika file gambar belum dimasukkan ke dalam folder assets
    lightboxImg.onerror = () => {
      lightboxImg.classList.add('hidden');
      if (lightboxCaption) {
        lightboxCaption.innerHTML = `
          <span class="block text-amber-400 font-semibold mb-1">Berkas gambar belum tersedia di folder:</span>
          <code class="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs">${imgSrc}</code>
          <span class="block mt-2 text-slate-400">${captionText || ''}</span>
        `;
      }
    };

    lightboxModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal || !lightboxImg) return;
    lightboxModal.classList.add('hidden');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('data-lightbox');
      const captionText = trigger.getAttribute('data-caption');
      if (imgSrc) {
        openLightbox(imgSrc, captionText);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && !lightboxModal.classList.contains('hidden')) {
      closeLightbox();
    }
  });

  /* ==========================================================================
     4. PENANGANAN GAMBAR THUMBNAIL KARTU YANG BELUM DIISI
     ========================================================================== */
  const cardImages = document.querySelectorAll('article img, #pengabdian img, #sertifikasi img');
  cardImages.forEach((img) => {
    img.addEventListener('error', function () {
      // Menyembunyikan ikon broken-image pada kartu jika file gambar belum ditaruh
      this.style.opacity = '0';
    });
  });
  /* ==========================================================================
     5. FITUR SALIN EMAIL & NOMOR KE CLIPBOARD
     ========================================================================== */
  const setupCopyBtn = (btnId, textToCopy) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Tersalin!</span> ✓';
        btn.classList.add('text-emerald-500', 'font-semibold');
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('text-emerald-500', 'font-semibold');
        }, 2000);
      }).catch(err => {
        console.error('Gagal menyalin:', err);
      });
    });
  };

  setupCopyBtn('copy-email-btn', 'ahmadzq2004@gmail.com');
  setupCopyBtn('copy-phone-btn', '+6285848477782');
});
