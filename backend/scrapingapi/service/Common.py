import re
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from newspaper import Article
from scrapingapi.service.NewsPaperDateExtractor import NewsPaperDateExtractor


class Common:
    def __init__(self):
        self.news_paper_date_extractor = NewsPaperDateExtractor()

    def extract_article_from_url(self, url):
        try:
            article_text, article_date, article_title = self.extract_article_data(url)
            return article_text, article_date, article_title
        except Exception as e:
            print(f"Error processing {url}: {e}")
            return None, None, None

    def extract_article_data(self, url, timeout=20):
        url = self.remove_www(url)
        headers = {'User-Agent': 'Mozilla/5.0'}
        article_text = None
        article_date = None
        article_title = None

        if 'probashirdiganta.com' in url:
            # Fetch and store HTML content first for probashirdiganta.com
            html_content = self.fetch_html_content(url, headers)
            if html_content:
                soup = BeautifulSoup(html_content, 'html.parser')
                article_text = soup.find('div', class_='post-details').get_text(strip=True) \
                    if soup.find('div', class_='post-details') else None
                article_title = soup.find('h1').get_text(strip=True) if soup.find('h1') else None
                date_element = soup.find('div', class_='post-time')
                if date_element:
                    published_text = date_element.find('span', text=re.compile('Published:')).get_text(strip=True)
                    published_date = published_text.replace('Published:', '').strip()
                    datetime_obj = datetime.strptime(published_date, '%d %b %Y, %I:%M %p')
                    article_date = datetime_obj.strftime('%m/%d/%Y %I:%M:%S %p')
            else:
                print(f"Error retrieving content from {url}")
        else:

            try:
                # First, use newspaper3k for text extraction
                article = Article(url)
                article.download()
                article.parse()
                article_text = article.text
                article_title = article.title
                article_meta_description = article.meta_description
                print("article text newspaper 3k working")
                print("this url:", url)

                # Append the meta description to the article text
                if 'bdnews24.com' in url:
                    article_text = article_meta_description + "\n\n" + article_text

                if 'en.prothomalo.com' in url:
                    article_text = self.get_article_text_prothom_alo(url)

                # Attempt to get the publishing date from newspaper3k
                if article.publish_date:
                    # Format the date if it's not None
                    print("article publish date newspaper 3k working")
                    print("working url:", url)
                    article_date = article.publish_date.strftime('%m/%d/%Y %I:%M:%S %p')
                    if 'newagebd.net' in url:
                        article_date = self.news_paper_date_extractor.extract_date_by_source(url)
                else:
                    # Use the custom extraction method and format the date
                    print("that url:", url)
                    print("article publish date newspaper 3k not working")
                    # If newspaper3k fails to get the date, use the custom extraction method
                    article_date = self.news_paper_date_extractor.extract_date_by_source(url)
                    print("after getting the article date while Article() dont have it")

            except Exception as e:
                # If newspaper3k fails entirely, use requests and BeautifulSoup for text extraction
                print(f"Error with newspaper3k for {url}: {e}")
                article_text, article_title = self.extract_text_with_requests(url, timeout)
                # Use the custom extraction method for the date
                article_date = self.news_paper_date_extractor.extract_date_by_source(url)
                # article_title=extract_title_by_source(url)

            print("article_date=", article_date)
            print("article title=", article_title)

        return article_text, article_date, article_title

    @staticmethod
    def remove_www(url):
        return url.replace('www.', '')

    @staticmethod
    def fetch_html_content(url, headers):
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.text
        else:
            print(f"Failed to retrieve content from {url}")
            return None

    @staticmethod
    def get_article_text_prothom_alo(url):
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            # Assuming the article text is contained within divs with the class 'story-content'
            article_content_div = soup.find('div', class_='story-content')
            paragraphs = article_content_div.find_all('p') if article_content_div else []

            # Joining the text from all the paragraph tags
            article_text = ' '.join(paragraph.get_text(strip=True) for paragraph in paragraphs)

            return article_text
        else:
            return "Failed to retrieve the article text."

    def extract_text_with_requests(self, url, timeout=20):
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=timeout)

        if response.status_code == 200:
            # Call the custom extraction function if the URL matches a known pattern
            return self.extract_text_custom(response.text, url)
        else:
            print(f"URL blocked or not found: {url}")
            return None

    @staticmethod
    def extract_text_custom(html, url):
        # Custom logic for extracting text based on the website's structure
        soup = BeautifulSoup(html, "lxml")
        article_text = None
        article_title = None

        if 'dhakatribune.com' in url:
            # Extracting the article title using the new class name and itemprop
            title_element = soup.find('h1', {'itemprop': 'headline', 'class': 'title mb10'})
            if title_element:
                article_title = title_element.get_text(strip=True)
            else:
                print("Title element not found.")

            # Extracting the article body text
            article_body = soup.find('div', class_='jw_article_body')
            if article_body:
                article_text = ' '.join(p.get_text().strip() for p in article_body.find_all('p'))
            else:
                print("Article body not found.")

        # Example for Jagonews24
        if 'jagonews24.com/en' in url:
            content_element = soup.find('div', class_='content-details')
            article_text = content_element.get_text(strip=True) if content_element else None

        return article_text, article_title
