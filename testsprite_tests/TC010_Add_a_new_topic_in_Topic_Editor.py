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
        
        # -> Click the '➕ İlk Fənni Əlavə Et' (Add first subject) button to create a subject (element index 95).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fill the New Subject form (name and target topic) and submit it to create the subject so the test can continue to the Topic Editor.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Riyaziyyat')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[2]/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Triqonometriyaya qədər')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[3]/button[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Re-open the 'Add Subject' modal and create the subject (submit the form) so the Topic Editor can be accessed.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the visible '➕ İlk Fənni Əlavə Et' button (use the fresh element index 225) to open the New Subject modal so the subject can be created.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fill the New Subject form (Fənn adı + Hansı mövzuya qədər) and submit the form to create the subject.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Riyaziyyat')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[2]/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Triqonometriyaya qədər')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[3]/button[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the visible '➕ İlk Fənni Əlavə Et' / '➕ Yeni Fənn Əlavə Et' button (element index 225) to open the New Subject modal so the subject can be created.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the visible '➕ İlk Fənni Əlavə Et' button to open the New Subject modal so the subject can be created.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fill the New Subject form and submit it so a subject is created (enter name and target, then click save). Then proceed to open the subject and add a topic.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Riyaziyyat')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[2]/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Triqonometriyaya qədər')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[1]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the New Subject modal by clicking the '➕ İlk Fənni Əlavə Et' button so the subject can be created.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Submit the New Subject form by clicking the 'Əlavə et →' (Add) button to create the subject so the Topic Editor can be accessed.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the New Subject modal using a fresh/additional button (click the '➕ Yeni Fənn Əlavə Et' button at index 798) so a fresh set of modal element indexes are loaded for submitting the form.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[1]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fill the New Subject form (Fənn adı and Hansı mövzuya qədər) and submit it so the subject is created.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Riyaziyyat')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[2]/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Triqonometriyaya qədər')
        
        # -> Click the 'Əlavə et →' (Add) button in the New Subject modal to submit and create the subject so the Topic Editor can be accessed.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/div[2]/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Mövzuları yarat' link (index 923) under the 'Riyaziyyat' subject to open the Topic Editor so topics can be added and verified.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[3]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Mövzuları yarat' link for the 'Riyaziyyat' subject to open the Topic Editor (use element index 1053).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[3]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the '🤖 AI ilə Mövzu Siyahısı Yarat' button to generate or reveal the topic list (element index 1072).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Type 'Yeni Mövzu 1' into the new-topic input (index 1303) and submit it so the topic is added to the list, then verify it appears.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Yeni Mövzu 1')
        
        # -> Type 'Yeni Mövzu 1' into the visible new-topic input (index 1505) and submit it (send Enter) to add the topic, then verify it appears.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Yeni Mövzu 1')
        
        # -> Type 'Yeni Mövzu 1' into the visible new-topic input (index 2266), submit it (send Enter), then search the page for the exact text 'Yeni Mövzu 1' to verify it appears.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Yeni Mövzu 1')
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        # -> Assertions: verify the Topic Editor list is visible and the new topic appears
        frame = context.pages[-1]
        # Wait for the topic editor container/header to be visible
        await frame.locator("text=Mövzular").wait_for(state="visible", timeout=5000)
        # Alternatively ensure the topic-list descriptive text is visible
        await frame.locator("text=Mövzu siyahısını").wait_for(state="visible", timeout=5000)
        # Verify the added topic text is visible in the list
        assert await frame.locator("text=Yeni Mövzu 1").is_visible(), "Expected topic 'Yeni Mövzu 1' to be visible in the topic list"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    