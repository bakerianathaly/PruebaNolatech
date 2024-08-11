//Envio de correo al empleado para notificar que tiene una prueba
import nodemailer from 'nodemailer'

// Configura tu transporte aquí, reemplazando con tus credenciales
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.CORREO_ELECTRONICO,
        pass: process.env.CORREO_ELECTRONICO_PASS
    }
})

export const enviarCorreo = (destinatario, nombreEmpleado, fechaLimite) => {
    const mailOptions = {
        from: process.env.CORREO_ELECTRONICO,
        to: destinatario,
        subject: '¡Tienes una evaluación pendiente por responder!',
        text: `¡Hola ${nombreEmpleado}!

            Me complace anunciar que estamos implementando un proceso de evaluaciónes. 
            Esto es parte de nuestro esfuerzo continuo para aumentar nuestro impacto, 
            apoyar el desarrollo del personal y promover la equidad y la transparencia. 

            La evaluación estara disponible hasta el dia ${fechaLimite}.
            
            Gracias por tu esfuerzo y dedicación a nuestro equipo.`
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    })
}

