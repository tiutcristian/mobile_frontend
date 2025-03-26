function filterListings (listings, search) {
    return listings.filter((l) =>
        l.title.toLowerCase().includes(search.toLowerCase())
    );
}

module.exports = filterListings;