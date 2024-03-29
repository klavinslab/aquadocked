#
# Installation specific stuff here
#

#
# Name of the instance (Change to the name of your lab)
# 
Bioturk::Application.config.instance_name = "Tidal C00l"

#
# URLs
#

Bioturk::Application.config.github_path = "https://github.com/yourlab"
Bioturk::Application.config.image_server_interface = 'http://your.image.server'
Bioturk::Application.config.vision_server_interface = ''

#
# Configuration
# 
Bioturk::Application.config.debug_tools = true # false will hide debug buttons in planner and manager
Bioturk::Application.config.krill_port = 3500


#
# Set CSRF token names
#
Bioturk::Application.config.angular_rails_csrf_options = {
    cookie_name: "XSRF-TOKEN_#{Bioturk::Application.environment_name}",
    header_name: "X-XSRF-TOKEN_#{Bioturk::Application.environment_name}"
}
