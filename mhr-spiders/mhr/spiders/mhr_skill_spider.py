import scrapy
import re
import datetime
import pymongo
from decimal import Decimal
from urllib.parse import urlparse


class SkillSpider(scrapy.Spider):
    name = "mhr_skill"

    def start_requests(self):
        yield scrapy.Request(url='http://mhrise.mhrice.info/skill.html', callback=self.parse)

    def parse(self, response):
        current_url = urlparse(response.url)

        for li in response.css('li.mh-list-skill'):
            details_anchors = li.css('a')
            if len(details_anchors) == 1:
                details_anchor = details_anchors[0]
                details_url = '{root.scheme}://{root.netloc}{details}'.format(
                    root=current_url, details=details_anchor.attrib['href'])
                yield scrapy.Request(url=details_url, callback=self.parseDetails)

    def parseDetails(self, response):
        name_jp = response.css('h1.title span > span.mh-lang-0::text').get()
        name_en = response.css('h1.title span > span.mh-lang-1::text').get()
        name_cn = response.css('h1.title span > span.mh-lang-13::text').get()
        max = len(response.css('div.content ul > li'))

        skill = {
            'name_jp': name_jp,
            'name_en': name_en,
            'name_cn': name_cn,
            'max': max,
        }

        self.save_details(skill)

    def save_details(self, details):
        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        mydb = myclient["mhr"]
        mycol = mydb["skill"]
        mycol.insert_one(details)
