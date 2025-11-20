import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, updateDoc, deleteDoc, 
    doc, getDocs, getDoc, setDoc 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCDWDEiUw9415MiGlFSiE4WZ0-B1FfQAA0",
    authDomain: "cinestar-5055b.firebaseapp.com",
    projectId: "cinestar-5055b",
    storageBucket: "cinestar-5055b.firebasestorage.app",
    messagingSenderId: "860650461110",
    appId: "1:860650461110:web:658b7e1fde99932aead317"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const db = getFirestore(app);

export async function registerUser(email, password, firstName, lastName, role = 'empleado') {
    try {
        console.log("Creando usuario en Auth...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Usuario creado en Auth, UID:", user.uid);
        
        console.log("Creando documento en Firestore...");
        await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            email,
            role: role,
            createdAt: new Date()
        });
        console.log("Documento creado en Firestore");
        
        return true;
    } catch(error) {
        console.error("Error completo en registerUser:", error);
        console.error("Código de error:", error.code);
        console.error("Mensaje de error:", error.message);
        return false;
    }
}

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const dataUser = await getDoc(doc(db, "users", user.uid));

        if (dataUser.exists()) {
            console.log('Usuario logueado con éxito');
            return { ...dataUser.data(), uid: user.uid };
        } else {
            throw new Error('No se encontró en la base de datos el usuario');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        return null;
    }
}

export async function saveMovie(movieData) {
    try {
        await addDoc(collection(db, "movies"), {
            ...movieData,
            createdAt: new Date()
        });
        return true;
    } catch (error) {
        console.error('Error guardando película:', error);
        return false;
    }
}

export async function getMovies() {
    try {
        const querySnapshot = await getDocs(collection(db, "movies"));
        const movies = [];
        querySnapshot.forEach((doc) => {
            movies.push({ id: doc.id, ...doc.data() });
        });
        return movies;
    } catch (error) {
        console.error('Error obteniendo películas:', error);
        return [];
    }
}

export async function savePromotion(promotionData) {
    try {
        await addDoc(collection(db, "promotions"), {
            ...promotionData,
            createdAt: new Date()
        });
        return true;
    } catch (error) {
        console.error('Error guardando promoción:', error);
        return false;
    }
}

export async function saveProduct(productData) {
    try {
        await addDoc(collection(db, "products"), {
            ...productData,
            createdAt: new Date()
        });
        return true;
    } catch (error) {
        console.error('Error guardando producto:', error);
        return false;
    }
}

export { signOut };