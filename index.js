const cheerio = require('cheerio')
const request = require('request')

function cleanupString(str) {
  return str.replace("\n", '').trim()
}
function cleanupDate(str) {
  return cleanupString(str).split("\n").map((e) => e.trim()).join(" ")
}

const organizerPageURL = 'https://www.eventbrite.it/o/torino-hacknight-9053329779'

request(organizerPageURL, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    // console.log(html)
    const $ = cheerio.load(html)

    const selector = "#live_events"
    let events = []

    $(".list-card-v2", selector).each((idx, e) => {
      // console.log(e)
      events.push({
        title: cleanupString($('.list-card__title', $(e)).text()),
        date: cleanupDate($('.list-card__date', $(e)).text()),
        venue: cleanupString($('.list-card__venue', $(e)).text()),
        imageURL: $('.list-card__image img').attr('src'),
        url: $('a', $(e)).attr('href'),
        eid: "eventbrite:" + $('a', $(e)).attr('data-eid'),
      })
    })

    console.log(events)
  }
})
