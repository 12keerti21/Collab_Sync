import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Firebase config - replace with your actual config or import from firebaseConfig.js
const firebaseConfig = {
  apiKey: "AIzaSyCQgAgWnNkqAb21TW3Fy6uqkfYIrZ1sxQg",
  authDomain: "collabsync-27407.firebaseapp.com",
  projectId: "collabsync-27407",
  storageBucket: "collabsync-27407.firebasestorage.app",
  messagingSenderId: "21840907250",
  appId: "1:21840907250:web:792459993cce5f9246b96b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addSampleData() {
  try {
    // Add sample task
    const taskRef = await addDoc(collection(db, 'tasks'), {
      title: 'Sample Task 1',
      description: 'This is a sample task created by script.',
      createdBy: 'user1',
      assignedTo: 'user2',
      clientId: 'client1',
      deadline: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
      priority: 'High',
      status: 'Open',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('Sample task added with ID:', taskRef.id);

    // Add sample comment for the task
    const commentRef = await addDoc(collection(db, 'comments'), {
      taskId: taskRef.id,
      userId: 'user2',
      text: 'This is a sample comment on the sample task.',
      createdAt: Timestamp.now(),
    });
    console.log('Sample comment added with ID:', commentRef.id);

    console.log('Sample data added successfully.');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

addSampleData();
