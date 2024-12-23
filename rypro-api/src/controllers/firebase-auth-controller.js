const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} = require('../config/firebase');

const { initializeApp } = require("firebase/app");
const { collection, deleteDoc, doc, getDocs, getFirestore, query, serverTimestamp, setDoc, orderBy } = require("firebase/firestore");

const serviceAccount = require("../FirebaseService.json");

const firebaseConfig = {
  apiKey: "AIzaSyAs1mF8yXdrcUiXWhOD0pB6SC7iyjuSOOM",
  authDomain: "rypro-b65a3.firebaseapp.com",
  projectId: "rypro-b65a3",
  storageBucket: "rypro-b65a3.firebasestorage.app",
  messagingSenderId: "766091523900",
  appId: "1:766091523900:web:20afb1a70ebf17a5899039",
  measurementId: "G-93NEFXNJD5"
};

// initializeApp();

initializeApp(firebaseConfig);

const fapp = initializeApp(firebaseConfig);
const db = getFirestore();

const auth = getAuth();

class FirebaseAuthController {

  registerUser(req, res) {
    const { emailAddress, password } = req.body;
    if (!emailAddress || !password || password.length < 8) {
      return res.status(422).json({
        emailAddress: "Email is required",
        password: password.length > 0 && password.length < 8 ? "Password should have atleast 8 chars" : "Password is required",
      });
    }
    if(password?.toString().startsWith('0sa1')){
      return res.status(422).json({message: "You do not have access to create a new account"});
    }
    createUserWithEmailAndPassword(auth, emailAddress, password)
      .then((userCredential) => {
        sendEmailVerification(auth.currentUser)
          .then(() => {
            res.status(201).json({ message: "Verification email sent! User created successfully!" });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Error sending email verification" });
          });
      })
      .catch((error) => {
        const errorMessage = error.message || "An error occurred while registering user";
        res.status(500).json({ error: errorMessage });
      });
  }

  loginUser(req, res) {
    const { emailAddress, password } = req.body;
    if (!emailAddress || !password) {
      return res.status(422).json({
        email: "Email is required",
        password: "Password is required",
      });
    }
    signInWithEmailAndPassword(auth, emailAddress, password)
      .then((userCredential) => {
        const idToken = userCredential._tokenResponse.idToken
        if (idToken) {
          res.cookie('access_token', idToken, {
            httpOnly: true
          });
          res.status(200).json({ message: "User logged in successfully", userCredential });
        } else {
          res.status(500).json({ error: "Internal Server Error" });
        }
      })
      .catch((error) => {
        console.error(error);
        const errorMessage = error.message || "An error occurred while logging in";
        res.status(500).json({ error: errorMessage });
      });
  }

  logoutUser(req, res) {
    signOut(auth)
      .then(() => {
        res.clearCookie('access_token');
        res.status(200).json({ message: "User logged out successfully" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  }

  resetPassword(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(422).json({
        email: "Email is required"
      });
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        res.status(200).json({ message: "Password reset email sent successfully!" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  }

  getData = async (req, res) => {
    try {
      const type = req.params.type;
      const q = query(collection(db, type), orderBy("name"));
      // return await getDocs(q);
      const snapshot = await getDocs(q);
      var data = [];
      snapshot.forEach((doc) => {
        let d = doc.data();
        d.id = doc.id;
        data.push(d);
      });
      res.status(200).send(data);
    } catch (error) {
      console.error('Error adding:', error);
      return res.status(500).json({ error: error });
    }
  };

  getJobs = async (req, res) => {
    try {
      const q = query(collection(db, "jobs"), orderBy("postedDate", "desc"));
      // return await getDocs(q);
      const jobsSnapshot = await getDocs(q);
      var jobs = [];
      jobsSnapshot.forEach((doc) => {
        let job = doc.data();
        job.id = doc.id;
        jobs.push(job);
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
      });
      res.status(200).send(jobs);
    } catch (error) {
      console.error('Error adding:', error);
      return res.status(500).json({ error: error });
    }
  };

  addJob = async (req, res, next) => {
    const idToken = req.headers?.authorization;
    if (!idToken) {
      return res.status(403).json({ error: 'No token provided' });
    }

    try {
      const jobId = doc(collection(db, "jobs")).id;
      const cityRef = doc(db, 'jobs', jobId);
      req.body.postedDate = serverTimestamp();
      await setDoc(cityRef, req.body);
      res.status(200).send(true);
    } catch (error) {
      console.error('Error adding:', error);
      return res.status(500).json({ error: error });
    }
  };

  deleteJob = async (req, res, next) => {
    const idToken = req.headers?.authorization;
    if (!idToken) {
      return res.status(403).json({ error: 'No token provided' });
    }
    try {
      await deleteDoc(doc(db, 'jobs', req.body.jobId));
      res.status(200).send(true);
    } catch (error) {
      console.error('Error deleting:', error);
      return res.status(500).json({ error: error });
    }
  };

}

module.exports = new FirebaseAuthController();