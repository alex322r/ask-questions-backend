import {randomUUID} from "node:crypto"
import { Router } from "express"; 
import jwt from "jsonwebtoken";

const router = Router()

router.post('/guest', function handleGuestToken(req, res) {
    const { guest_name } = req.body

    if (!guest_name || guest_name.length < 3 || guest_name > 30) {
        return res.status(400).json({error: "El nombre debe tener entre 3 y 30 caracteres"})

    }
    const guest_id = randomUUID()
    try {
        const token = jwt.sign({ guest_id, guest_name }, process.env.SECRET_KEY)
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax' 
        })
        res.json({message: 'Login exitoso'})
    } catch (error) {
        res.status(500).json({error: "Error interno"})
    }

} )

router.post('/login', function handleLogin(req, res) {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({error: "Por favor, ingrese todos los campos"})
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({error: "Credenciales incorrectas"})
    }

    try {
        const token = jwt.sign({ email }, process.env.SECRET_KEY)
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none' 

        })
        res.json({message: 'Login exitoso'})
    } catch (error) {
        res.status(500).json({error: "Error interno"})
    }
})

export default router




