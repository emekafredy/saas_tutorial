class ContactsController < ApplicationController
  #GET request to /contact us
  #show new contact form
  def new
    @contact = Contact.new
  end
  
  #POST request to /contacts
  def create
    #Mass assignment of form fields into contact object
    @contact = Contact.new(contact_params)
    #Saving of contact object to a database
    if @contact.save
      #If saved, store form fields through parameters, into variables
      name = params[:contact][:name]
      email = params[:contact][:email]
      body = params[:contact][:comments]
      #Add variables to ContactMailer email method and send email
      ContactMailer.contact_email(name, email, body).deliver
      #Display success message and redirect to new contact page
      flash[:success] = "Your message was sent successfully."
      redirect_to new_contact_path
    else
      #If not saved, display error message and redirect to new contact page
      flash[:danger] = @contact.errors.full_messages.join(", ")
      redirect_to new_contact_path
    end
  end
  
  private
    #We need to use strong parameters to collect data from forms
    def contact_params
      params.require(:contact).permit(:name, :email, :comments)
    end
end