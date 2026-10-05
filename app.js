const subjects = [];

const subjectsContainer = document.getElementById("subjects");
const searchInput = document.getElementById("searchInput");

function displaySubjects(list) {

    if (list.length === 0) {
        subjectsContainer.innerHTML = `
            <div class="empty-message">
                <h3>📂 No practicals found</h3>
                <p>Try another search.</p>
            </div>
        `;
        return;
    }

    subjectsContainer.innerHTML = list.map(subject => `
        <div class="subject-card">

            <div class="subject-icon">
                ${subject.icon}
            </div>

            <h3>${subject.name}</h3>

            <p>
                ${subject.files.length} practicals
            </p>

            <div class="pdf-list">

                ${subject.files.map(file => `
                    <a
                        class="pdf-button"
                        href="${file.path}"
                        target="_blank"
                    >
                        📄 ${file.name}
                        <span>↗</span>
                    </a>
                `).join("")}

            </div>

        </div>
    `).join("");
}


searchInput.addEventListener("input", () => {

    const search = searchInput.value.toLowerCase();

    const filtered = subjects.filter(subject =>
        subject.name.toLowerCase().includes(search) ||
        subject.files.some(file =>
            file.name.toLowerCase().includes(search)
        )
    );

    displaySubjects(filtered);
});


displaySubjects(subjects);


/* OFFLINE STATUS */

function updateOnlineStatus() {

    const status = document.getElementById("offlineStatus");

    if (navigator.onLine) {
        status.textContent = "🟢 Online";
        status.style.color = "#22c55e";
    } else {
        status.textContent = "🔴 Offline";
        status.style.color = "#ef4444";
    }
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

updateOnlineStatus();