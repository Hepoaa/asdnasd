/* =====================================================
   BOOK ENGINE - Page Flip System with 3D Transforms
   ===================================================== */

class BookEngine {
    constructor(container, options = {}) {
        this.container = container;
        this.pagesContainer = container.querySelector('#pages-container');
        this.options = {
            pageFlipDuration: 800,
            dragThreshold: 0.5,
            ...options
        };

        this.pages = [];
        this.currentSpread = 0; // Current spread (0 = pages 1-2, 1 = pages 3-4, etc.)
        this.totalPages = 20;
        this.isAnimating = false;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragCurrentX = 0;
        this.draggedPage = null;

        this.callbacks = {
            onPageChange: null,
            onFlipStart: null,
            onFlipEnd: null
        };
    }

    // Initialize the book with all pages
    init(pageContents) {
        this.createPages(pageContents);
        this.attachEventListeners();
        this.updateVisibility();
    }

    // Create all page elements
    createPages(pageContents) {
        this.pagesContainer.innerHTML = '';

        for (let i = 0; i < this.totalPages; i++) {
            const page = this.createPageElement(i, pageContents[i]);
            this.pages.push(page);
            this.pagesContainer.appendChild(page);
        }

        this.updatePageZIndices();
    }

    // Create a single page element with front and back
    createPageElement(index, content) {
        const page = document.createElement('div');
        page.className = 'page right-page';
        page.dataset.pageIndex = index;

        // Front side (odd page numbers: 1, 3, 5, ...)
        const front = document.createElement('div');
        front.className = 'page-front';
        front.innerHTML = `
            <div class="page-border"></div>
            <div class="page-content">
                ${content.front || ''}
            </div>
            <span class="page-number">${index + 1}</span>
            <div class="page-shadow"></div>
        `;

        // Back side (even page numbers: 2, 4, 6, ...)
        const back = document.createElement('div');
        back.className = 'page-back';
        back.innerHTML = `
            <div class="page-border"></div>
            <div class="page-content">
                ${content.back || ''}
            </div>
            <span class="page-number">${index + 2}</span>
        `;

        page.appendChild(front);
        page.appendChild(back);

        return page;
    }

    // Attach all event listeners
    attachEventListeners() {
        // Click navigation on page edges
        this.pages.forEach((page, index) => {
            page.addEventListener('click', (e) => this.handlePageClick(e, index));

            // Drag events
            page.addEventListener('mousedown', (e) => this.handleDragStart(e, page));
            page.addEventListener('touchstart', (e) => this.handleDragStart(e, page), { passive: false });
        });

        // Global drag events
        document.addEventListener('mousemove', (e) => this.handleDragMove(e));
        document.addEventListener('mouseup', (e) => this.handleDragEnd(e));
        document.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleDragEnd(e));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // Handle page click
    handlePageClick(e, pageIndex) {
        if (this.isAnimating || this.isDragging) return;

        const page = this.pages[pageIndex];
        const rect = page.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pageWidth = rect.width;

        // Click on right side of visible right page = next
        // Click on left side of visible left page = prev
        if (!page.classList.contains('flipped')) {
            if (clickX > pageWidth * 0.6) {
                this.nextPage();
            }
        } else {
            if (clickX < pageWidth * 0.4) {
                this.prevPage();
            }
        }
    }

    // Handle drag start
    handleDragStart(e, page) {
        if (this.isAnimating) return;

        // Get position
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const rect = page.getBoundingClientRect();
        const relX = clientX - rect.left;

        // Only start drag from corner areas
        const cornerWidth = rect.width * 0.3;
        const canDrag = (!page.classList.contains('flipped') && relX > rect.width - cornerWidth) ||
            (page.classList.contains('flipped') && relX < cornerWidth);

        if (!canDrag) return;

        this.isDragging = true;
        this.dragStartX = clientX;
        this.dragCurrentX = clientX;
        this.draggedPage = page;

        page.style.transition = 'none';
        page.classList.add('dragging');

        e.preventDefault();
    }

    // Handle drag move
    handleDragMove(e) {
        if (!this.isDragging || !this.draggedPage) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        this.dragCurrentX = clientX;

        const delta = this.dragCurrentX - this.dragStartX;
        const pageWidth = this.draggedPage.getBoundingClientRect().width;
        const maxRotation = 180;

        let rotation;
        if (this.draggedPage.classList.contains('flipped')) {
            // Dragging a flipped page to unflip
            rotation = -180 + Math.min(maxRotation, Math.max(0, (delta / pageWidth) * maxRotation));
        } else {
            // Dragging a non-flipped page to flip
            rotation = Math.max(-maxRotation, Math.min(0, (delta / pageWidth) * maxRotation));
        }

        this.draggedPage.style.transform = `rotateY(${rotation}deg)`;

        // Update shadow intensity based on rotation
        const shadowIntensity = Math.abs(rotation) / 180;
        const shadow = this.draggedPage.querySelector('.page-shadow');
        if (shadow) {
            shadow.style.opacity = shadowIntensity * 0.5;
        }

        e.preventDefault();
    }

    // Handle drag end
    handleDragEnd(e) {
        if (!this.isDragging || !this.draggedPage) return;

        const delta = this.dragCurrentX - this.dragStartX;
        const pageWidth = this.draggedPage.getBoundingClientRect().width;
        const progress = Math.abs(delta) / pageWidth;

        const page = this.draggedPage;
        page.style.transition = `transform ${this.options.pageFlipDuration / 2}ms ease`;
        page.classList.remove('dragging');

        if (progress > this.options.dragThreshold) {
            // Complete the flip
            if (page.classList.contains('flipped') && delta > 0) {
                this.prevPage();
            } else if (!page.classList.contains('flipped') && delta < 0) {
                this.nextPage();
            } else {
                // Revert
                this.revertDrag();
            }
        } else {
            // Revert the drag
            this.revertDrag();
        }

        this.isDragging = false;
        this.draggedPage = null;
    }

    // Revert a cancelled drag
    revertDrag() {
        if (!this.draggedPage) return;

        const isFlipped = this.draggedPage.classList.contains('flipped');
        this.draggedPage.style.transform = isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)';

        setTimeout(() => {
            if (this.draggedPage) {
                this.draggedPage.style.transition = '';
                this.draggedPage.style.transform = '';
            }
        }, this.options.pageFlipDuration / 2);
    }

    // Handle keyboard navigation
    handleKeyboard(e) {
        if (this.isAnimating) return;

        switch (e.key) {
            case 'ArrowRight':
            case 'PageDown':
                this.nextPage();
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                this.prevPage();
                e.preventDefault();
                break;
            case 'Home':
                this.goToPage(1);
                e.preventDefault();
                break;
            case 'End':
                this.goToPage(this.totalPages);
                e.preventDefault();
                break;
        }
    }

    // Navigate to next page/spread
    nextPage() {
        if (this.isAnimating) return;
        if (this.currentSpread >= this.pages.length - 1) return;

        this.flipPage(this.currentSpread, 'forward');
    }

    // Navigate to previous page/spread
    prevPage() {
        if (this.isAnimating) return;
        if (this.currentSpread <= 0) return;

        this.flipPage(this.currentSpread - 1, 'backward');
    }

    // Go to specific page
    goToPage(pageNum) {
        if (this.isAnimating) return;

        pageNum = Math.max(1, Math.min(this.totalPages, pageNum));
        const targetSpread = Math.floor((pageNum - 1) / 2);

        if (targetSpread === this.currentSpread) return;

        // For large jumps, do instant transition
        if (Math.abs(targetSpread - this.currentSpread) > 3) {
            this.instantGoToSpread(targetSpread);
        } else {
            // Animate through pages
            this.animateToSpread(targetSpread);
        }
    }

    // Flip a single page with animation
    flipPage(spreadIndex, direction) {
        const page = this.pages[spreadIndex];
        if (!page) return;

        this.isAnimating = true;

        if (this.callbacks.onFlipStart) {
            this.callbacks.onFlipStart(spreadIndex, direction);
        }

        // Play sound
        if (typeof audioManager !== 'undefined') {
            audioManager.playPageFlip();
        }

        page.classList.add('flipping');

        if (direction === 'forward') {
            page.classList.add('flipped');
            this.currentSpread++;
        } else {
            page.classList.remove('flipped');
            this.currentSpread--;
        }

        // Update z-indices for proper stacking
        this.updatePageZIndices();

        setTimeout(() => {
            page.classList.remove('flipping');
            this.isAnimating = false;
            this.updateVisibility();

            if (this.callbacks.onFlipEnd) {
                this.callbacks.onFlipEnd(this.currentSpread);
            }

            if (this.callbacks.onPageChange) {
                this.callbacks.onPageChange(this.getCurrentPageNumbers());
            }
        }, this.options.pageFlipDuration);
    }

    // Instant navigation for large jumps
    instantGoToSpread(targetSpread) {
        // Remove transition temporarily
        this.pages.forEach(page => {
            page.style.transition = 'none';
        });

        // Update all pages
        for (let i = 0; i < this.pages.length; i++) {
            if (i < targetSpread) {
                this.pages[i].classList.add('flipped');
            } else {
                this.pages[i].classList.remove('flipped');
            }
        }

        this.currentSpread = targetSpread;
        this.updatePageZIndices();
        this.updateVisibility();

        // Re-enable transitions
        requestAnimationFrame(() => {
            this.pages.forEach(page => {
                page.style.transition = '';
            });
        });

        if (this.callbacks.onPageChange) {
            this.callbacks.onPageChange(this.getCurrentPageNumbers());
        }
    }

    // Animate through multiple pages
    async animateToSpread(targetSpread) {
        const direction = targetSpread > this.currentSpread ? 'forward' : 'backward';
        const steps = Math.abs(targetSpread - this.currentSpread);

        for (let i = 0; i < steps; i++) {
            if (direction === 'forward') {
                this.nextPage();
            } else {
                this.prevPage();
            }
            await this.wait(this.options.pageFlipDuration * 0.6);
        }
    }

    // Update page z-indices for correct stacking
    updatePageZIndices() {
        const total = this.pages.length;
        this.pages.forEach((page, index) => {
            if (page.classList.contains('flipped')) {
                // Flipped pages stack from left
                page.style.zIndex = index;
            } else {
                // Unflipped pages stack from right
                page.style.zIndex = total - index;
            }
        });
    }

    // Update page visibility
    updateVisibility() {
        // Show only relevant pages for performance
        this.pages.forEach((page, index) => {
            const isNearCurrent = Math.abs(index - this.currentSpread) <= 2;
            page.style.visibility = isNearCurrent ? 'visible' : 'hidden';
        });
    }

    // Get current visible page numbers
    getCurrentPageNumbers() {
        const leftPage = this.currentSpread * 2;
        const rightPage = leftPage + 1;
        return {
            left: leftPage + 1, // 1-indexed
            right: Math.min(rightPage + 1, this.totalPages)
        };
    }

    // Check if can go forward
    canGoForward() {
        return this.currentSpread < this.pages.length - 1;
    }

    // Check if can go backward
    canGoBackward() {
        return this.currentSpread > 0;
    }

    // Set callback
    on(event, callback) {
        if (this.callbacks.hasOwnProperty('on' + event.charAt(0).toUpperCase() + event.slice(1))) {
            this.callbacks['on' + event.charAt(0).toUpperCase() + event.slice(1)] = callback;
        }
    }

    // Utility: wait
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get spread index for a page number
    getSpreadForPage(pageNum) {
        return Math.floor((pageNum - 1) / 2);
    }
}

// Export
window.BookEngine = BookEngine;
