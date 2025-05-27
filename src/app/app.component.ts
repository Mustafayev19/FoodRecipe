// src/app/app.component.ts
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isSidebarOpen = false;
  isDesktop = false; // Ekran ölçüsünü izləmək üçün (Tailwind-in 'md' breakpoint-i ilə uyğunlaşdırılacaq)

  constructor() { }

  ngOnInit() {
    // Brauzerdə işlədiyimizdən əmin olmaq üçün yoxlama (SSR zamanı window olmur)
    if (typeof window !== 'undefined') {
      this.checkScreenWidth(window.innerWidth);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event | undefined) { // event opsional ola bilər
    if (event && typeof window !== 'undefined') {
      this.checkScreenWidth(window.innerWidth);
    }
  }

  private checkScreenWidth(width: number): void {
    // Tailwind-in 'md' breakpoint-i adətən 768px-dir.
    const mdBreakpoint = 768;
    this.isDesktop = width >= mdBreakpoint;
    if (this.isDesktop) {
      // Desktop rejimində mobil sidebar həmişə bağlı olmalıdır ki,
      // md:translate-x-0 öz işini görsün və transformlarla konflikt olmasın.
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    // Yalnız mobil/tablet rejimində (isDesktop false olduqda) sidebar-ı açıb-bağlayırıq.
    // Desktopda sidebar həmişə açıqdır (md:relative və md:translate-x-0 sayəsində).
    if (!this.isDesktop) {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }
}