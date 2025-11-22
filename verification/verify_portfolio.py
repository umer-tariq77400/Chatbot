from playwright.sync_api import Page, expect, sync_playwright

def verify_portfolio(page: Page):
    # Go to home page
    page.goto("http://127.0.0.1:8000/")
    expect(page).to_have_title("Alex Dev - Portfolio")

    # Check for Hero section
    expect(page.get_by_text("Building digital experiences that matter")).to_be_visible()

    # Check for Projects
    expect(page.get_by_role("heading", name="Featured Projects")).to_be_visible()

    # Navigate to Projects
    page.get_by_role("link", name="Projects").first.click()
    expect(page.get_by_role("heading", name="Projects")).to_be_visible()
    expect(page.get_by_text("NeonCommerce Dashboard")).to_be_visible()

    # Navigate to Blog
    page.get_by_role("link", name="Blog").first.click()
    expect(page.get_by_role("heading", name="Blog")).to_be_visible()
    expect(page.get_by_text("Mastering React 18 Concurrency")).to_be_visible()

    # Check chat widget toggle
    chat_toggle = page.locator("#toggle-chat")
    expect(chat_toggle).to_be_visible()
    chat_toggle.click()

    # Check chat window opens
    chat_window = page.locator("#chat-window")
    expect(chat_window).to_be_visible()
    expect(page.get_by_text("Portfolio Assistant")).to_be_visible()

    # Take screenshot
    page.screenshot(path="/home/jules/verification/verification.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_portfolio(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            # Capture screenshot on failure too
            try:
                page.screenshot(path="/home/jules/verification/verification_failed.png", full_page=True)
            except:
                pass
        finally:
            browser.close()
