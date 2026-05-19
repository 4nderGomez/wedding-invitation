export function initSubmitForm() {
    const form = document.getElementById("rsvpForm");

    if(!form) return;

    form.addEventListener("input", () => {
        const data = {
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            city: document.getElementById("city").value,
            message: document.getElementById("message").value,
        };

        localStorage.setItem("rsvpDraft", JSON.stringify(data));
    });

    //recuperando datos guardados
    const saved = localStorage.getItem("rsvpDraft");

    if(saved) {
        const data = JSON.parse(saved);
        
        document.getElementById("phone").value = data.phone || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("city").value = data.city || "";
        document.getElementById("message").value = data.message || "";
    }

    //Submit
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";

        //Obtención de datos basicos
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const city = document.getElementById("city").value;
        const message = document.getElementById("message").value;

        //Obtención de los adultos y niños
        const guests = [];

        //Invitado principal
        const mainName = document.getElementById("mainName").value;
        const mainLastname = document.getElementById("mainLastname").value;

        guests.push({
            name: mainName,
            lastname: mainLastname,
            type: "adult"
        });

        //Invitados extra
        document.querySelectorAll("#guestsContainer .guest-card").forEach(row => {
            const inputs = row.querySelectorAll("input");

            const type = row.dataset.type || "adult";

            guests.push({
                name: inputs[0].value.trim(),
                lastname: inputs[1].value.trim(),
                type
            });
        });

        //Validación
        if(!phone.match(/^\d{10}$/)) {
            alert("El teléfono debe tener diez digitos");
            submitBtn.disabled = false;
            submitBtn.textContent = "Confirmar asistencia";
            return;
        }

        if(!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert("Correo no valido");
            submitBtn.disabled = false;
            submitBtn.textContent = "Confirmar asistencia";
            return;
        }

        if(!mainName || !mainLastname) {
            alert("Debes agregar al menos un invitado");
            submitBtn.disabled = false;
            submitBtn.textContent = "Confirmar asistencia";
            return;
        }

        for(let g of guests) {
            if(!g.name.trim() || !g.lastname.trim()) {
                alert("Todos los invitados deben tener nombre y apellido");
                submitBtn.disabled = false;
                submitBtn.textContent = "Confirmar asistencia";
                return;
            }
        }

        //Creación del JSON
        const data = {
            attendance: "yes",
            phone,
            email,
            city,
            message,
            guests
        };

        try {
            //Envia al backend
            const response = await fetch("https://wedding-invitation-production-4c94.up.railway.app/api/rsvp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            let result;

            try {
                result = await response.json()
            } catch {
                result = await response.text();
            }

            if(response.ok) {
                showSuccessToast(
                    "Confirmación enviada",
                    "Gracias por confirmar tu asistencia."
                );
                localStorage.removeItem("rsvpDraft");

                const decision = document.getElementById("attendanceDecision");
                const btn = document.getElementById("confirmDecisionBtn");
                const specialDay = document.querySelector(".heart-day");

                decision.disabled = true;
                btn.disabled = true;

                document.getElementById("formModal").classList.remove("active");
                document.body.style.overflow = "auto";

                //Limpiar formulario
                form.reset();
                document.getElementById("guestsContainer").innerHTML = "";

                if(specialDay) {
                    specialDay.classList.add("confirmed");
                }
            } else {
                if(typeof result === "object") {
                    const messages = Object.values(result).join("\n");
                    alert(messages)
                } else 
                    alert(result);

                submitBtn.disabled = false;
                submitBtn.textContent = "Confirmar asistencia";
            }
        } catch(error) {
            alert("No se pudo conectar con el servidor");
            submitBtn.disabled = false;
            submitBtn.textContent = "Confirmar asistencia";
        }

    });

    //Cuando RSVP dice que no
    const declineForm = document.getElementById("declineForm");

    if (declineForm) {
        declineForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = declineForm.querySelector("button[type='submit']");
            submitBtn.disabled = true;
            submitBtn.textContent = "Enviando...";

            const name = document.getElementById("declineName").value.trim();
            const lastname = document.getElementById("declineSurname").value.trim();
            const phone = document.getElementById("declinePhone").value.trim();
            const email = document.getElementById("declineEmail").value.trim();
            const city = document.getElementById("declineCity").value;

            if (!name || !lastname) {
                alert("Debes escribir nombre y apellido");
                submitBtn.disabled = false;
                submitBtn.textContent = "Enviar";
                return;
            }

            if (!phone.match(/^\d{10}$/)) {
                alert("El teléfono debe tener diez dígitos");
                submitBtn.disabled = false;
                submitBtn.textContent = "Enviar";
                return;
            }

            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                alert("Correo no válido");
                submitBtn.disabled = false;
                submitBtn.textContent = "Enviar";
                return;
            }

            if (!city) {
                alert("Selecciona si vienes fuera de Miahuatlán");
                submitBtn.disabled = false;
                submitBtn.textContent = "Enviar";
                return;
            }

            const data = {
                attendance: "no",
                phone,
                email,
                city,
                message: "",
                guests: [
                    {
                        name,
                        lastname,
                        type: "adult"
                    }
                ]
            };

            try {
                const response = await fetch("https://wedding-invitation-production-4c94.up.railway.app/api/rsvp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                let result;

                try {
                    result = await response.json();
                } catch {
                    result = await response.text();
                }

                if (response.ok) {
                    showSuccessToast(
                        "Respuesta enviada correctamente.",
                        "Lamentamos que no puedas asistir."
                    );

                    declineForm.reset();

                    document.getElementById("formModal").classList.remove("active");
                    document.body.style.overflow = "auto";
                } else {
                    if (typeof result === "object") {
                        const messages = Object.values(result).join("\n");
                        alert(messages);
                    } else {
                        alert(result);
                    }

                    submitBtn.disabled = false;
                    submitBtn.textContent = "Enviar";
                }
            } catch (error) {
                alert("No se pudo conectar con el servidor");
                submitBtn.disabled = false;
                submitBtn.textContent = "Enviar";
            }
        });
    }
}

function showSuccessToast(title, message) {
    const toast = document.getElementById("successToast");
    const titleEl = toast.querySelector("h3");
    const messageEl = toast.querySelector("p");
    const closeBtn = document.getElementById("closeSuccessToast");

    titleEl.textContent = title;
    messageEl.textContent = message;

    toast.classList.add("active");

    closeBtn.onclick = () => {
        toast.classList.remove("active");
    };

    setTimeout(() => {
        toast.classList.remove("active");
    }, 3500);
}