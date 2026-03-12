// ============================
// QUIZ DATA — 5 quizzes × 10 questions each
// ============================

const quizzes = [
  {
    id: 1,
    title: "General Knowledge",
    category: "General Knowledge",
    description: "Test your overall knowledge with a mix of questions.",
    image: "images/5_files/46ff5531156fa9603a942996db3051a2.jpg",
    featured: true,
    featuredTitle: "The Universe",
    featuredDesc: "Test your knowledge about the cosmos.",
    questions: [
      { q: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Rome"], answer: 1 },
      { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
      { q: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], answer: 2 },
      { q: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], answer: 2 },
      { q: "What is the currency of Japan?", options: ["Yuan", "Won", "Yen", "Ringgit"], answer: 2 },
      { q: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"], answer: 2 },
      { q: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: 1 },
      { q: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: 2 },
      { q: "What is the boiling point of water in Celsius?", options: ["90°C", "100°C", "110°C", "120°C"], answer: 1 },
      { q: "How many days are there in a leap year?", options: ["364", "365", "366", "367"], answer: 2 }
    ]
  },
  {
    id: 2,
    title: "Science",
    category: "Science",
    description: "Explore the wonders of science from biology to physics.",
    image: "images/5_files/abstract-background-with-cream-color-geometric-3d-vector-37258349.jpg",
    featured: true,
    featuredTitle: "Ancient Civilizations",
    featuredDesc: "Explore the mysteries of ancient cultures.",
    questions: [
      { q: "What is the chemical symbol for water?", options: ["H2O", "CO2", "NaCl", "O2"], answer: 0 },
      { q: "What planet is closest to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], answer: 2 },
      { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Body"], answer: 2 },
      { q: "What gas do humans exhale?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], answer: 2 },
      { q: "What is the speed of light approximately?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"], answer: 0 },
      { q: "Which element has the atomic number 1?", options: ["Helium", "Hydrogen", "Oxygen", "Carbon"], answer: 1 },
      { q: "What force keeps us grounded on Earth?", options: ["Magnetism", "Friction", "Gravity", "Inertia"], answer: 2 },
      { q: "How many bones are in the adult human body?", options: ["186", "206", "226", "246"], answer: 1 },
      { q: "What is the largest organ of the human body?", options: ["Heart", "Liver", "Skin", "Lungs"], answer: 2 },
      { q: "Which vitamin is produced when skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], answer: 3 }
    ]
  },
  {
    id: 3,
    title: "History",
    category: "History",
    description: "Journey through time and learn about historical events.",
    image: "images/5_files/original-475c121896e706e8df1675df98aefc2d.jpg",
    featured: true,
    featuredTitle: "Shakespearean Plays",
    featuredDesc: "Dive into the world of the Bard.",
    questions: [
      { q: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], answer: 2 },
      { q: "Who was the first President of the United States?", options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"], answer: 1 },
      { q: "Which civilization built the pyramids of Giza?", options: ["Roman", "Greek", "Egyptian", "Mesopotamian"], answer: 2 },
      { q: "What was the name of the ship that sank in 1912?", options: ["Lusitania", "Titanic", "Britannic", "Olympic"], answer: 1 },
      { q: "The French Revolution began in which year?", options: ["1776", "1789", "1799", "1804"], answer: 1 },
      { q: "Who discovered America in 1492?", options: ["Vasco da Gama", "Ferdinand Magellan", "Christopher Columbus", "Amerigo Vespucci"], answer: 2 },
      { q: "Which empire was ruled by Genghis Khan?", options: ["Ottoman", "Roman", "Mongol", "Persian"], answer: 2 },
      { q: "The Berlin Wall fell in which year?", options: ["1987", "1988", "1989", "1990"], answer: 2 },
      { q: "Who was known as the Iron Lady?", options: ["Angela Merkel", "Margaret Thatcher", "Indira Gandhi", "Golda Meir"], answer: 1 },
      { q: "Which ancient city was buried by Mount Vesuvius?", options: ["Rome", "Athens", "Pompeii", "Carthage"], answer: 2 }
    ]
  },
  {
    id: 4,
    title: "Literature",
    category: "Literature",
    description: "Discover the world of books and authors.",
    image: "images/5_files/46ff5531156fa9603a942996db3051a2.jpg",
    featured: false,
    questions: [
      { q: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], answer: 1 },
      { q: "What is the first book of the Harry Potter series?", options: ["Chamber of Secrets", "Prisoner of Azkaban", "Philosopher's Stone", "Goblet of Fire"], answer: 2 },
      { q: "Who wrote '1984'?", options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"], answer: 1 },
      { q: "In which novel does the character Jay Gatsby appear?", options: ["The Great Gatsby", "To Kill a Mockingbird", "Moby Dick", "Catcher in the Rye"], answer: 0 },
      { q: "Who is the author of 'Pride and Prejudice'?", options: ["Emily Brontë", "Charlotte Brontë", "Jane Austen", "Virginia Woolf"], answer: 2 },
      { q: "What is the longest novel ever written by word count?", options: ["War and Peace", "Les Misérables", "A la recherche du temps perdu", "Don Quixote"], answer: 2 },
      { q: "Who wrote 'The Odyssey'?", options: ["Virgil", "Homer", "Sophocles", "Plato"], answer: 1 },
      { q: "Which Shakespeare play features the character Hamlet?", options: ["Macbeth", "Othello", "Hamlet", "King Lear"], answer: 2 },
      { q: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "F. Scott Fitzgerald", "Ernest Hemingway", "John Steinbeck"], answer: 0 },
      { q: "What genre is 'Lord of the Rings'?", options: ["Science Fiction", "Fantasy", "Horror", "Mystery"], answer: 1 }
    ]
  },
  {
    id: 5,
    title: "Mathematics",
    category: "Mathematics",
    description: "Challenge your math skills with various problems.",
    image: "images/5_files/original-475c121896e706e8df1675df98aefc2d.jpg",
    featured: false,
    questions: [
      { q: "What is the value of Pi rounded to two decimal places?", options: ["3.12", "3.14", "3.16", "3.18"], answer: 1 },
      { q: "What is the square root of 144?", options: ["10", "11", "12", "13"], answer: 2 },
      { q: "What is 15% of 200?", options: ["20", "25", "30", "35"], answer: 2 },
      { q: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], answer: 1 },
      { q: "What is the next prime number after 7?", options: ["9", "10", "11", "13"], answer: 2 },
      { q: "What is 8 × 7?", options: ["54", "56", "58", "64"], answer: 1 },
      { q: "What is the sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], answer: 1 },
      { q: "What is 2 to the power of 10?", options: ["512", "1024", "2048", "4096"], answer: 1 },
      { q: "What is the factorial of 5 (5!)?", options: ["60", "100", "120", "150"], answer: 2 },
      { q: "If x + 5 = 12, what is x?", options: ["5", "6", "7", "8"], answer: 2 }
    ]
  }
];
