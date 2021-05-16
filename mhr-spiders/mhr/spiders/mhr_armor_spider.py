import scrapy
import re
import datetime
import pymongo
from decimal import Decimal
from urllib.parse import urlparse


class ArmorSpider(scrapy.Spider):
    name = "mhr_armor"

    def start_requests(self):
        yield scrapy.Request(url='http://mhrise.mhrice.info/armor.html', callback=self.parse)

    def parse(self, response):
        current_url = urlparse(response.url)

        # for li in response.css('li.mh-armor-series-list'):
        #     details_anchors = li.css('a')
        #     if len(details_anchors) == 1:
        #         details_anchor = details_anchors[0]
        #         details_url = '{root.scheme}://{root.netloc}{details}'.format(
        #             root=current_url, details=details_anchor.attrib['href'])
        #         yield scrapy.Request(url=details_url, callback=self.parseDetails)

        yield scrapy.Request(url='https://mhrise.kiranico.com/zh/data/armors/518775850', callback=self.parseRare)

    def parseDetails(self, response):
        name_jp = response.css('h1.title span > span.mh-lang-0::text').get()
        name_en = response.css('h1.title span > span.mh-lang-1::text').get()
        name_cn = response.css('h1.title span > span.mh-lang-13::text').get()
        armor_list = response.css('div.content table tbody tr')

        self.parseArmor(armor_list[0], 1)
        self.parseArmor(armor_list[1], 2)
        self.parseArmor(armor_list[2], 3)
        self.parseArmor(armor_list[3], 4)
        self.parseArmor(armor_list[4], 5)

    def parseArmor(self, row, type):
        tds = row.css('td')

        if len(tds) > 1:
            name_jp = tds[0].css('td span > span.mh-lang-0::text').get()
            name_en = tds[0].css('td span > span.mh-lang-1::text').get()
            name_cn = tds[0].css('td span > span.mh-lang-13::text').get()
            slotStr = tds[8].css('td::text').get()
            slots = [] if slotStr == None else list(
                map(lambda i: int(i.strip()), slotStr.split('/')))
            skills = tds[9].css('ul.mh-armor-skill-list li')
            skillArr = []

            for li in skills:
                skill_name_jp = li.css('span.mh-lang-0::text').get()
                skill_name_en = li.css('span.mh-lang-1::text').get()
                skill_name_cn = li.css('span.mh-lang-13::text').get()
                level = int(re.findall('[0-9]+', li.css('li::text').get())[0])
                skillArr.append({
                    'skill_name_jp': skill_name_jp,
                    'skill_name_en': skill_name_en,
                    'skill_name_cn': skill_name_cn,
                    'level': level,
                })

            armor = {
                'type': type,
                'name_jp': name_jp,
                'name_en': name_en,
                'name_cn': name_cn,
                'slots': slots,
                'skills': skillArr,
            }

            self.save_details(armor)

    def parseRare(self, response):
        cols = response.css('.grid .sm\:col-span-1')
        colRare = cols[4]
        name = response.css(
            'h1.text-2xl.font-bold.text-gray-900.truncate::text').get().strip()
        rare = int(colRare.css('dd.mt-1::text').get())
        self.save_rare({'name_cn': name, 'rare': rare})

        next = response.css(
            'a.ml-3.relative.inline-flex.items-center.px-4.py-2.border.border-gray-300.text-sm.font-medium.rounded-md.text-gray-700.bg-white')
        nextUrl = next.attrib['href']

        print('-------------------')
        print(nextUrl)

        if next != None:
            yield scrapy.Request(url=nextUrl, callback=self.parseRare)

    def save_details(self, details):
        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        mydb = myclient["mhr"]
        mycol = mydb["armor"]
        if mycol.find_one({'name_cn': details['name_cn']}) == None:
            mycol.insert_one(details)

    def save_rare(self, details):
        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        mydb = myclient["mhr"]
        mycol = mydb["armor"]
        find = mycol.find_one({'name_cn': details['name_cn']})

        if find != None:
            mycol.update_one(find,  {'$set':  {'rare': details["rare"]}})
