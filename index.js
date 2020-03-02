const cheerio = require('cheerio')
const axios = require('axios')

function cleanupString(str) {
  return str.replace("\n", '').trim()
}
function cleanupDate(str) {
  return cleanupString(str).split("\n").map((e) => e.trim()).join(" ")
}

const organizerPageURL = 'https://www.eventbrite.it/o/torino-hacknight-9053329779'

async function getOrganizerEvents(url) {
  let response
  try {
    response = await axios.get(url)
  } catch(error) {
    console.error(error)
    return
  }

  const $ = cheerio.load(response.data)
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

  return events
}

getOrganizerEvents(organizerPageURL).then((events) => {
  console.log(events)
})
