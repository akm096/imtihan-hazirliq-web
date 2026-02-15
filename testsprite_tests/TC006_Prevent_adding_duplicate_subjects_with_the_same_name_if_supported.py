import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5173", wait_until="commit", timeout=10000)

        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass

        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:5173
        await page.goto("http://localhost:5173", wait_until="commit", timeout=10000)
        
        # -> Wait briefly for the SPA to load, then reload the page if no interactive elements appear.
        await page.goto("http://localhost:5173/", wait_until="commit", timeout=10000)
        
        # -> Wait a short time for SPA to load. If still no interactive elements, open the app in a new tab (http://localhost:5173/) to attempt rendering there.
        await page.goto("http://localhost:5173/", wait_until="commit", timeout=10000)
        
        # -> Wait briefly for the SPA to load, then navigate to http://127.0.0.1:5173/ in the current tab to try an alternate host.
        await page.goto("http://127.0.0.1:5173/", wait_until="commit", timeout=10000)
        
        # -> Click the Reload button on the error page to attempt to reconnect and load the SPA.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div[1]/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the Reload button (index 201) to retry loading the SPA, then wait 5 seconds and inspect the page for interactive elements.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div[1]/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Navigate directly to http://localhost:5173/ in the current tab (use direct URL navigation since no other clickable elements can load the app).
        await page.goto("http://localhost:5173/", wait_until="commit", timeout=10000)
        
        # -> Click the '➕ Yeni Fənn Əlavə Et' button to open the Add Subject modal (index 5).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[1]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Type 'Fizika' into the subject name field (input index 153), then type 'Bölmə 1' into the topic textarea (index 157), then click the submit button to add the subject.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Fizika')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[2]/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Bölmə 1')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[3]/button[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the '➕ Yeni Fənn Əlavə Et' modal so the subject input fields appear (click button index 5).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[1]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Reload the application to restore the SPA UI so interactive elements (buttons/inputs) are available. Then continue the test to add 'Fizika' (Bölmə 1) and verify duplicate behavior.
        await page.goto("http://localhost:5173/", wait_until="commit", timeout=10000)
        
        # -> Reload the app UI so interactive elements are available, then continue the add-subject duplicate verification flow (start by opening the Add Subject modal).
        await page.goto("http://localhost:5173/", wait_until="commit", timeout=10000)
        
        # -> Reload the application UI so interactive elements are available by navigating to the app URL and waiting; then inspect for the Add Subject button to continue the duplicate-name test.
        await page.goto("http://localhost:5173/", wait_until="commit", timeout=10000)
        
        # -> Open the Add Subject modal by clicking the '➕ Yeni Fənn Əlavə Et' button so the subject name and topic fields appear.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[1]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Type 'Fizika' into the subject name input, type 'Bölmə 1' into the topic textarea, then click the Add/Submit button to create the subject.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Fizika')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[2]/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Bölmə 1')
        
        # -> Click the 'Əlavə et' button to submit the first subject ('Fizika' - Bölmə 1).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/div[2]/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the Add Subject modal by clicking '➕ Yeni Fənn Əlavə Et' so the name and topic fields appear (click element index 894).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[1]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Type 'Fizika' into the subject name input (index 1020), type 'Bölmə 2' into the topic textarea (index 1024), then submit the form (send Enter key) to attempt adding the duplicate subject.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Fizika')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[2]/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Bölmə 2')
        
        # -> Click the 'Əlavə et' button (index 1026) to submit the duplicate subject ('Fizika' — Bölmə 2) and observe whether the UI blocks it or creates a second card.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/div[2]/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Restore SPA UI (reload/navigate) so interactive elements are available, then reopen Add Subject modal and complete the duplicate submission attempt, and observe whether duplicate is blocked or allowed. Next immediate action: navigate to the app URL and wait for it to render.
        await page.goto("http://localhost:5173/", wait_until="commit", timeout=10000)
        
        # -> Open the Add Subject modal so the name and topic fields appear (click '➕ Yeni Fənn Əlavə Et' button). Then proceed to add duplicate 'Fizika' (Bölmə 2) and observe whether the UI blocks it or creates a second card.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[1]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Type 'Fizika' into the subject name input, type 'Bölmə 2' into the topic textarea, then click the 'Əlavə et' button to attempt adding the duplicate subject and observe the result.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Fizika')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[2]/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Bölmə 2')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[3]/button[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the Add Subject modal so the name and topic inputs appear (click '➕ Yeni Fənn Əlavə Et', index 1233).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[1]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Əlavə et →' submit button to attempt adding the duplicate subject ('Fizika' — Bölmə 2) and observe whether the UI blocks it or creates another card.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        frame = context.pages[-1]
        await page.wait_for_timeout(1000)
        # Verify at least one 'Fizika' is visible
        assert await frame.locator("text=Fizika").count() >= 1, "Expected at least one 'Fizika' subject visible"
        b1 = await frame.locator("text=Fizika Bölmə 1").count()
        b2 = await frame.locator("text=Fizika Bölmə 2").count()
        if b2 >= 1:
            # Duplicate was allowed — ensure both entries are present
            assert b1 >= 1, "Expected original 'Fizika Bölmə 1' to exist when duplicate allowed"
        else:
            # Duplicate was blocked — look for an error/notification message
            err_msgs = ["artıq mövcuddur", "Artıq mövcuddur", "mövcuddur", "already exists", "duplicate"]
            found_err = False
            for msg in err_msgs:
                if await frame.locator(f"text={msg}").count() > 0:
                    found_err = True
                    break
            assert found_err, "Duplicate subject was not added and no blocking message was found"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    