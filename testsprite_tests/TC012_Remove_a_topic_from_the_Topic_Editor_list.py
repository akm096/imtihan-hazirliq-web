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
        
        # -> Click the '➕ Yeni Fənn Əlavə Et' (Add New Subject) button to create a subject so topics can be added/managed (use interactive element index 90).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[1]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fill subject name and target fields in the modal and click the 'Əlavə et' (Add) button to create the subject.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test Fənn')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[2]/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Triqonometriyaya qədər')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[3]/button[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open the Add Subject modal again so the subject can be submitted (click the '➕ Yeni Fənn Əlavə Et' button).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[1]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Əlavə et →' (Add) button in the Add Subject modal to create the subject (interactive element index 236).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div[2]/div/div[2]/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Mövzuları yarat' link/button on the subject card to open the topic editor / topic creation view so a topic can be added.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[3]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Mövzuları yarat' link on the subject card to open the Topic Editor (use element index 400).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[3]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the '🤖 AI ilə Mövzu Siyahısı Yarat' button to generate topics for the subject so a topic can be removed and the removal verified.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the delete (Sil) icon/button next to the first topic (Təbii ədədlər) to start removal (use interactive element index 464). Then handle the confirmation dialog in the following step.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the current delete icon for the first topic using index 893, then wait for a confirmation dialog or the topic list to update.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the delete icon for the first topic (use interactive element index 909), then wait for the UI to show a confirmation dialog or update the topic list.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Reload the topics page to recover the UI and re-scan for interactive elements (confirmation dialog or topic list). If confirmation dialog appears, click Confirm; otherwise locate the first topic and retry removal, then verify the topic is gone.
        await page.goto("http://localhost:5173/subject/827f9e34-b7fe-4da2-9130-32d10b6ed862/topics", wait_until="commit", timeout=10000)
        
        # -> Click the delete (Sil) icon for the first topic to trigger deletion/confirmation (use index 1620).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the delete (Sil) icon for the first topic to trigger deletion (index 1637), wait for UI update/confirmation, then extract the topic presence and counts to verify removal.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click delete icon for the first topic (index 1976), wait for UI update, then check whether the topic 'Çoxhədlilərin vuruqlara ayrılması' is present and get the total and first 5 titles.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the delete icon for the first topic ('Rasional ifadələr') using index 1992, wait for the UI to update, then check whether the topic is still present and get the total and first 5 titles.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the delete icon for the first topic (index 2009), wait for the UI to update, then extract whether 'Kvadrat köklər və qüvvət' is still present, the total topic count, and the first 5 titles.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the delete (Sil) icon for the first topic (index 2299), wait 2s for UI update, then extract whether 'Kvadrat köklər və qüvvət' is present, total topic count, and first 5 titles.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the delete icon for the first topic on the current stable page (index 2315), wait for the UI to update/confirmation, then extract whether 'Birdəyişənli tənliklər' is present, the total topic count, and the first 5 topic titles.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Reload / re-open the subject topics page to recover the UI and re-scan for interactive elements. After the page is stable, attempt deletion again (click delete, click confirm if shown, then verify that the topic is gone).
        await page.goto("http://localhost:5173/subject/827f9e34-b7fe-4da2-9130-32d10b6ed862/topics", wait_until="commit", timeout=10000)
        
        # -> Click the delete icon for the first topic (Kvadrat tənliklər), wait for UI update, then check whether the topic is still present and get the total and first 5 titles.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click delete icon for the first topic (index 2843), wait for UI update/confirmation, then extract whether 'Bərabərsizliklər' is present, the total topic count, and the first 5 topic titles.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the delete (Sil) icon for the first topic (Tənliklər sistemi) to trigger deletion, then wait for the UI to show a confirmation dialog or update the list.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Reload the subject topics page to recover the UI and rescan for interactive elements; then proceed to delete+confirm once the page is stable.
        await page.goto("http://localhost:5173/subject/827f9e34-b7fe-4da2-9130-32d10b6ed862/topics", wait_until="commit", timeout=10000)
        
        # -> Click delete icon for the first topic (Funksiyalar və qrafiklər), wait for UI update, then extract whether the topic is present, total topics, and first 5 titles to verify removal.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the delete icon next to 'Ədədi və həndəsi silsilələr' (index 3289), wait for the UI to update, then extract whether that topic is present, the total number of topics, and the first 5 topic titles.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Add a new topic so it can be removed (enter a topic title into the topic input and click the add button). After the page updates, proceed to delete+confirm and verify removal.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Topic to remove')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Type a new topic into the topic input (index 3359) and click the '➕ Əlavə et' add button (index 3457) to create a topic so it can be removed.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Topic to remove')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the '➕ Əlavə et' add button to create the new topic ('Topic to remove'), then wait for the topic list to update.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div[1]/div/div/div[2]/div/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the delete (Sil) icon next to 'Topic to remove', wait for UI update/confirmation, then check whether 'Topic to remove' is still present and return presence, total topics, and first 5 titles.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div/div/div/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        # Wait briefly for the UI to update after the delete action
        await page.wait_for_timeout(2000)
        # Verify the specific topic text is no longer present
        removed = await frame.locator("text=Topic to remove").count()
        assert removed == 0, f"'Topic to remove' still present (count={removed})"
        # Also verify the topic count shows zero in Azerbaijani or the English fallback
        zero_local = await frame.locator("text=0 mövzu").count()
        zero_en = await frame.locator("text=No topics").count()
        assert (zero_local + zero_en) > 0, "Topic count was not reduced to zero (neither '0 mövzu' nor 'No topics' found)"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    