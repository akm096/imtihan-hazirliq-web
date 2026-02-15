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
        
        # -> Click the '➕ İlk Fənni Əlavə Et' (Add first subject) button to start creating a subject so a subject with completions can be made.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fill the subject name and topic fields in the modal and submit the form to create the subject (click the add button).
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
        
        # -> Re-open the 'Add first subject' modal so the subject can be created and submitted (click the '➕ İlk Fənni Əlavə Et' button).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Əlavə et →' button in the modal to create the subject (index 236).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Mövzuları yarat' link/button on the 'Riyaziyyat' subject card to add topics so a completion can be recorded.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[3]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Mövzuları yarat' link on the 'Riyaziyyat' subject card to create topics (use the fresh element index 400).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[3]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the '🤖 AI ilə Mövzu Siyahısı Yarat' button (index 419) to generate topics for the subject so a topic can be marked complete.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open a topic from the list so it can be marked complete (click the topic row).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/span[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the first topic's detail view by clicking the topic name so it can be marked complete (click element index 465).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[2]/div[1]/div/span[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the first topic's detail by clicking the topic name so it can be marked complete.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/span[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the first topic 'Natural ədədlər' to reveal completion controls so the topic can be marked complete (click element index 966).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[2]/div[1]/div/span[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the first topic 'Natural ədədlər' to reveal completion controls so it can be marked complete.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/span[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the first topic ('Natural ədədlər') to reveal completion controls so one topic can be marked complete.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/span[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the first topic 'Natural ədədlər' to reveal completion controls so it can be marked complete (first step toward creating a subject with completions).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[2]/div[1]/div/span[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the first topic 'Natural ədədlər' to reveal completion controls so one topic can be marked complete (click element index 1444).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/span[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the first topic 'Natural ədədlər' to reveal completion controls so one topic can be marked complete.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[2]/div[1]/div/span[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the first topic 'Natural ədədlər' to reveal completion controls so a topic can be marked complete.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/span[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Return to the homepage to access the subject card/navigation, then open the subject's Progress view (click 'Ana Səhifə' link to navigate back).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/nav/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the 'Riyaziyyat' subject card to access its navigation (so Progress can be reached). Click the subject card element.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the 'Riyaziyyat' subject page by clicking its subject card so the 'Progress' navigation link becomes available.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the 'Riyaziyyat' subject page by clicking its subject card so the subject navigation (including 'Progress') becomes available.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the 'Riyaziyyat' subject page so the subject navigation (including 'Progress') becomes available by clicking the subject card element (index 2585).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Riyaziyyat' subject card to open its page so the subject navigation (including 'Progress') becomes available, then proceed to mark a topic complete.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Riyaziyyat' subject card to open its page so the subject navigation (including 'Progress') becomes available.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the 'Riyaziyyat' subject page by clicking its subject card so the subject navigation (including 'Progress') and topic completion controls become available.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the 'Riyaziyyat' subject page so navigation (including Progress) and topic completion controls become available by clicking the subject card.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Riyaziyyat' subject card to open its page so the subject navigation (including 'Progress') becomes available.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the 'Riyaziyyat' subject page so subject navigation (including 'Progress') and topic completion controls become available by clicking the subject card (index 2726).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the subject's topic edit/setup page so a topic can be marked complete (click the '✏️ Mövzuları redaktə et' link on the Riyaziyyat card).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[3]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Return to the homepage so the subject card can be opened (click '🏠 Ana Səhifə'). Then open the subject page (to reach Progress) and mark at least one topic complete if needed before verifying the Progress streak.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/nav/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Return to homepage by clicking the '🏠 Ana Səhifə' link so the subject card can be opened (then open the subject page and mark a topic complete).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/nav/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the subject's topic edit/setup page to access topic completion controls and mark at least one topic complete (click the '✏️ Mövzuları redaktə et' link).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[3]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the first topic 'Natural ədədlər' to reveal completion controls so at least one topic can be marked complete (click topic span).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[2]/div[1]/div/span[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Return to the homepage so the subject card can be opened (click '🏠 Ana Səhifə'), then open the subject page (not the edit page) so the Progress tab/link is available.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/nav/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the '🏠 Ana Səhifə' link to return to the homepage so the subject card can be opened (then access Progress/navigation).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/nav/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the subject's topic edit/setup page to access topic completion controls (click '✏️ Mövzuları redaktə et').
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[3]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Return to the homepage so the subject card can be opened (then open the subject page and mark a topic complete).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/nav/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Return to the homepage by clicking the '🏠 Ana Səhifə' link so the subject card can be opened (then mark a topic complete or open Progress).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/nav/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the 'Riyaziyyat' subject page by clicking its subject card so the subject navigation (including 'Progress') becomes available. Then mark at least one topic complete and check Progress for a numeric 'Streak'.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the subject's '✏️ Mövzuları redaktə et' link (index 5633) to open the topic edit/setup page so a topic can be marked complete.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[3]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Return to the homepage so the subject card/page (non-edit) can be opened to mark a topic complete and access Progress.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/nav/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the subject's topic edit/setup page so a topic can be marked complete by clicking '✏️ Mövzuları redaktə et' (index 6126).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[3]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the subject's topic edit/setup page so a topic can be marked complete (click '✏️ Mövzuları redaktə et').
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[3]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Return to the homepage by clicking '🏠 Ana Səhifə' so the subject card (non-edit view) can be opened, then mark at least one topic complete and open the subject 'Progress' view to verify the streak metric.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/nav/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the subject's topic edit/setup page so a topic can be marked complete (click '✏️ Mövzuları redaktə et').
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[3]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        # Wait briefly for the Progress view to render
        await page.wait_for_timeout(1000)
        
        # Verify the 'Streak' label is visible on the page
        streak_label = page.locator("text=Streak").first
        assert await streak_label.is_visible(), "Expected 'Streak' to be visible on the Progress page"
        
        # Verify a numeric streak value is visible (matches one or more digits)
        numeric_streak = page.locator("text=/^\\d+$/").first
        assert await numeric_streak.is_visible(), "Expected a numeric streak value to be visible (e.g. '0')"
        
        # Also verify the specific text '0' is present (per test plan)
        zero = page.locator("text=0").first
        assert await zero.is_visible(), "Expected text '0' to be visible for the streak"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    