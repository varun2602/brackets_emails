document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  document.querySelector('form').onsubmit = compose_send;
  // By default, load the inbox
  load_mailbox('inbox');
});
function compose_send()
{
  event.preventDefault()
  console.log(`HII`)
  recipient = document.querySelector('#compose-recipients').value
  sub = document.querySelector('#compose-subject').value
  body = document.querySelector('#compose-body').value

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipient,
        subject: sub,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  })
  load_mailbox('sent')
  return false
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view-emails').style.display = 'none'

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-emails').style.display = 'none';

  // Enable and disable archive buttons
  if(mailbox === "inbox"){
      document.querySelector("#archive_div").style.display = 'block'
      document.querySelector("#unarchive_div").style.display = 'none'
      
  }
  else if(mailbox === "archive"){
    document.querySelector("#unarchive_div").style.display = 'block'
    document.querySelector("#archive_div").style.display = 'none'
  }
  else if(mailbox == "sent"){
    document.querySelector("#archive_div").style.display = 'none'
    document.querySelector("#unarchive_div").style.display = 'none'
    
  }
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Iterating through the emails
    emails.forEach(item => {
      // Creating the div for appending the emails 
      const element = document.createElement('div');
      element.innerHTML = `${item.id}: ${item.subject}`;
      document.querySelector('#emails-view').append(element);
      // Adding border to the email
      element.style.border = '1px solid black'
      element.style.backgroundColor = 'grey'
      element.addEventListener('mouseover' , function() {
        element.style.backgroundColor = 'white'
      })
      // When the email is clicked
      element.addEventListener('click', () => { 
        
        // Checking with console 
        console.log(`Item: ${item.id}`)

        // Sending  GET request 
        fetch(`/emails/${item.id}`)
        .then(response => response.json())
        .then(email => {
            // Print email
            console.log(email);
            // Directing to email view 
            document.querySelector('#emails-view').style.display = 'none'
            document.querySelector('#compose-view').style.display = 'none'
            document.querySelector('#view-emails').style.display = 'block'
            document.querySelector('#id1').innerHTML = `Sender: ${email.sender}` 
            document.querySelector('#id2').innerHTML = `Recipient: ${email.recipients[0]}` 
            document.querySelector('#id3').innerHTML = `Timestamp: ${email.timestamp}` 
            document.querySelector('#id4').innerHTML = `Subject: ${email.subject}` 
            document.querySelector('#id5').innerHTML = `Body: ${email.body}` 

            
            
            // If archive button is pressed 
            document.querySelector('#archive').onclick = function(){
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: true
                })
              })
            }

            // If unarchive button is pressed 
            document.querySelector('#unarchive').onclick = function(){
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: false
                })
              })
            }

            // When reply button is clicked 
            document.querySelector('#reply').onclick = function(){
              console.log(email.sender)
              // Show compose view and hide other views
            document.querySelector('#emails-view').style.display = 'none';
            document.querySelector('#compose-view').style.display = 'block';
            document.querySelector('#view-emails').style.display = 'none'

           // Clear out composition fields
            document.querySelector('#compose-recipients').value = `${email.sender}`;
            document.querySelector('#compose-subject').value = `RE:${email.subject}`;
            document.querySelector('#compose-body').value = `On ${email.timestamp}, ${email.sender} replies:`;
            };
         });            
        console.log('This element has been clicked')
      })
      
      
    })
  }

    // ... do something else with email ...
  );
   
}

// `Sender: ${email.sender}
//             Recipient: ${email.recipients[0]}
//             Subject: ${email.subject}
//             Timestamp: ${email.timestamp}
//             Body: ${email.body}`