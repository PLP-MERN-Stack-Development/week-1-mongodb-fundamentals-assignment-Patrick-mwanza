// ===== Task 2: Basic CRUD Operations =====

// 1. Find all books in a specific genre (e.g., "Programming")
db.books.find({ genre: "Programming" }).pretty()

// 2. Find books published after a certain year (e.g., 2010)
db.books.find({ published_year: { $gt: 2010 } }).pretty()

// 3. Find books by a specific author (e.g., "George Orwell")
db.books.find({ author: "George Orwell" }).pretty()

// 4. Update the price of a specific book (e.g., "Clean Code" to 55)
db.books.updateOne(
  { title: "Clean Code" },
  { $set: { price: 55 } }
)

// 5. Delete a book by its title (e.g., "The Hobbit")
db.books.deleteOne({ title: "The Hobbit" })


// ===== Task 3: Advanced Queries =====

// 6. Find books that are in stock AND published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
}).pretty()

// 7. Use projection to return only title, author, price
db.books.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).pretty()

// 8. Sort books by price ascending
db.books.find().sort({ price: 1 }).pretty()

// 9. Sort books by price descending
db.books.find().sort({ price: -1 }).pretty()

// 10. Pagination: get first 5 books (page 1)
db.books.find().skip(0).limit(5).pretty()

// 11. Pagination: get next 5 books (page 2)
db.books.find().skip(5).limit(5).pretty()


// ===== Task 4: Aggregation Pipeline =====

// 12. Calculate average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
])

// 13. Find the author with the most books in the collection
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
])

// 14. Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: {
        $concat: [
          { $toString: { $subtract: [ "$published_year", { $mod: [ "$published_year", 10 ] } ] } },
          "s"
        ]
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])


// ===== Task 5: Indexing =====

// 15. Create index on title field
db.books.createIndex({ title: 1 })

// 16. Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 })

// 17. Explain example query performance before/after indexing
// Example: Find books by author with explain
db.books.find({ author: "George Orwell" }).explain("executionStats")
