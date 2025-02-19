const DB_NAME = 'QuizPlatformDB';
const DB_VERSION = 1;

let db = null;

async function initDB() {
  if (db) return db;
  
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening database:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('Database opened successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log('Database upgrade needed');
      
      if (!db.objectStoreNames.contains('quizzes')) {
        const store = db.createObjectStore('quizzes', { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        console.log('Created quizzes store');
      }

      if (!db.objectStoreNames.contains('attempts')) {
        const store = db.createObjectStore('attempts', { keyPath: 'id', autoIncrement: true });
        store.createIndex('quizId', 'quizId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('Created attempts store');
      }
    };
  });
}

export async function saveQuiz(quiz) {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['quizzes'], 'readwrite');
      const store = transaction.objectStore('quizzes');
      
      console.log('Saving quiz:', quiz); // Debug log
      const request = store.put(quiz);

      request.onsuccess = () => {
        console.log('Quiz saved successfully');
        resolve(quiz);
      };

      request.onerror = () => {
        console.error('Error saving quiz:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in saveQuiz:', error);
    throw error;
  }
}

export async function getQuiz(id) {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['quizzes'], 'readonly');
      const store = transaction.objectStore('quizzes');
      const request = store.get(id);

      request.onsuccess = () => {
        console.log('Retrieved quiz:', request.result); // Debug log
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Error getting quiz:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in getQuiz:', error);
    throw error;
  }
}

export async function getAllQuizzes() {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['quizzes'], 'readonly');
      const store = transaction.objectStore('quizzes');
      const request = store.getAll();

      request.onsuccess = () => {
        const quizzes = request.result;
        console.log('Retrieved all quizzes:', quizzes); // Debug log
        resolve(quizzes);
      };

      request.onerror = () => {
        console.error('Error getting quizzes:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in getAllQuizzes:', error);
    throw error;
  }
}

export async function saveAttempt(attempt) {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['attempts'], 'readwrite');
      const store = transaction.objectStore('attempts');
      
      const attemptWithTimestamp = {
        ...attempt,
        timestamp: new Date().toISOString()
      };
      
      console.log('Saving attempt:', attemptWithTimestamp); // Debug log
      const request = store.add(attemptWithTimestamp);

      request.onsuccess = () => {
        console.log('Attempt saved successfully');
        resolve({ ...attemptWithTimestamp, id: request.result });
      };

      request.onerror = () => {
        console.error('Error saving attempt:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in saveAttempt:', error);
    throw error;
  }
}

export async function getAttempts(quizId = null) {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['attempts'], 'readonly');
      const store = transaction.objectStore('attempts');
      const request = store.getAll();

      request.onsuccess = () => {
        let attempts = request.result;
        console.log('Retrieved attempts:', attempts); // Debug log
        
        if (quizId) {
          attempts = attempts.filter(attempt => attempt.quizId === quizId);
          console.log('Filtered attempts for quiz:', quizId, attempts);
        }
        
        resolve(attempts);
      };

      request.onerror = () => {
        console.error('Error getting attempts:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in getAttempts:', error);
    throw error;
  }
}

// Helper function to delete all data (useful for testing)
export async function clearDatabase() {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['quizzes', 'attempts'], 'readwrite');
      
      transaction.objectStore('quizzes').clear();
      transaction.objectStore('attempts').clear();

      transaction.oncomplete = () => {
        console.log('Database cleared successfully');
        resolve();
      };

      transaction.onerror = () => {
        console.error('Error clearing database:', transaction.error);
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error('Error in clearDatabase:', error);
    throw error;
  }
}