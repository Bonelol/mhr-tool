import scrapy
import re
import datetime
import pymongo
from decimal import Decimal
from urllib.parse import urlparse


class DecorationSpider(scrapy.Spider):
    name = "mhr_deco"

    def start_requests(self):
        yield scrapy.Request(url='https://mhrise.kiranico.com/zh/data/decorations', callback=self.parse)

    def parse(self, response):
        for tr in response.css('table.min-w-full tbody tr'):
            tds = tr.css('td')
            decorationStr = tds[0].css('a::text').get()
            decorationName = decorationStr.split('【')[0]
            level = int(re.findall('[0-9]+', decorationStr)[0])
            skill = tds[1].css('a::text').get()

            decoration = {
                'decoration_name': decorationName,
                'level': level,
                'skill': skill
            }

            self.save_details(decoration)

    def save_details(self, details):
        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        mydb = myclient["mhr"]
        mycol = mydb["decoration"]
        mycol.insert_one(details)
