const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://libreria-express-react.vercel.app';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'capturas');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const save = async (page, name) => {
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`✓ ${name}.png`);
};

const login = async (page) => {
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  const currentUrl = page.url();
  if (!currentUrl.includes(BASE_URL)) return;

  // If already logged in (books page visible), skip login
  const mainVisible = await page.locator('text=Gestión de Biblioteca').count();
  if (mainVisible > 0) return;

  // Login form
  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'biblioteca123');
  await page.click('button:has-text("Ingresar")');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // ── 1. Login vacío — errores de validación ────────────────────────────────
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  await page.click('button:has-text("Ingresar")');
  await page.waitForTimeout(500);
  await save(page, '01-login-errores');

  // ── 2. Login con credenciales correctas ───────────────────────────────────
  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'biblioteca123');
  await save(page, '02-login');

  // ── 3. Ingresar a pantalla principal (DB ya tiene libros) ─────────────────
  await page.click('button:has-text("Ingresar")');
  // Esperar hasta que aparezca la tabla o el mensaje vacío (backend puede tardar en Render)
  await page.waitForSelector('table, .sin-libros, text=No hay libros', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1000);
  await save(page, '03-pantalla-principal');

  // Verificar que hay libros
  const hayLibros = await page.locator('table').count();
  if (!hayLibros) {
    console.error('⚠ No se encontraron libros en la tabla. Agregá libros primero desde el browser.');
    await browser.close();
    process.exit(1);
  }

  // ── 4. Modal de alta (vacío) ───────────────────────────────────────────────
  await page.click('button:has-text("Agregar libro")');
  await page.waitForTimeout(400);
  await save(page, '04-modal-alta-vacio');

  // ── 5. Modal de alta con datos completados ────────────────────────────────
  await page.fill('input[name="titulo"]', 'Rayuela');
  await page.fill('input[name="autor"]', 'Julio Cortazar');
  await page.fill('input[name="anio"]', '1963');
  await save(page, '05-modal-alta-datos');

  // Cancelar sin guardar
  await page.click('button:has-text("Cancelar")');
  await page.waitForTimeout(300);

  // ── 6. Modal de edición prellenado ────────────────────────────────────────
  const editBtns = page.locator('button:has-text("Editar")');
  const editCount = await editBtns.count();
  if (editCount > 0) {
    await editBtns.first().click();
    await page.waitForTimeout(500);
    await save(page, '06-modal-edicion');
    await page.click('button:has-text("Cancelar")');
    await page.waitForTimeout(300);
  }

  // ── 7. Toast de éxito (guardando una edición) ─────────────────────────────
  const editBtns2 = page.locator('button:has-text("Editar")');
  if (await editBtns2.count() > 0) {
    await editBtns2.first().click();
    await page.waitForTimeout(400);
    await page.click('button:has-text("Guardar")');
    await page.waitForTimeout(600);
    await save(page, '07-toast-exito');
    await page.waitForTimeout(3000);
  }

  // ── 8. Buscador con resultados filtrados ──────────────────────────────────
  const searchInput = page.locator('input[placeholder*="título" i]');
  await searchInput.fill('Principito');
  await page.waitForTimeout(400);
  await save(page, '08-buscador-filtrado');
  await searchInput.fill('');
  await page.waitForTimeout(300);

  // ── 9. Filtro por disponibilidad ──────────────────────────────────────────
  await page.locator('select').selectOption('disponibles');
  await page.waitForTimeout(300);
  await save(page, '09-filtro-disponibles');
  await page.locator('select').selectOption('todos');

  // ── 10. Diálogo de eliminación — mock visual ──────────────────────────────
  // Reemplazamos window.confirm por un overlay DOM para capturarlo en headless
  await page.evaluate(() => {
    window._originalConfirm = window.confirm;
    window.confirm = (msg) => {
      const overlay = document.createElement('div');
      overlay.id = '_mock_dialog';
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;
        align-items:center;justify-content:center;z-index:9999;
      `;
      overlay.innerHTML = `
        <div style="background:#fff;border-radius:8px;padding:24px 32px;max-width:400px;
                    box-shadow:0 4px 20px rgba(0,0,0,.3);font-family:sans-serif;">
          <p style="margin:0 0 20px;font-size:15px;">
            ¿Estás seguro de que querés eliminar este libro?
          </p>
          <div style="display:flex;gap:12px;justify-content:flex-end;">
            <button style="padding:8px 20px;border:1px solid #ccc;border-radius:4px;
                           background:#fff;cursor:pointer;">Cancelar</button>
            <button style="padding:8px 20px;border:none;border-radius:4px;
                           background:#2563eb;color:#fff;cursor:pointer;">Aceptar</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
      return true;
    };
  });

  const deleteBtns = page.locator('button:has-text("Eliminar")');
  if (await deleteBtns.count() > 0) {
    await deleteBtns.first().click();
    await page.waitForTimeout(600);
    await save(page, '10-confirmacion-eliminar');
    // Restaurar y limpiar
    await page.evaluate(() => {
      window.confirm = window._originalConfirm;
      const el = document.getElementById('_mock_dialog');
      if (el) el.remove();
    });
    await page.waitForTimeout(500);
  }

  await browser.close();
  console.log('\n✅ Todas las capturas guardadas en docs/capturas/');
})();
