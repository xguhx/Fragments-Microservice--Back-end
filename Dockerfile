# This is a Dockerfile, this will instruct docker on how to build our image.

# Lets build our image on top of the Node image (version 16.13.2)
# Make it super explicit
FROM node:16.13.2-apline3.14@sha256:d5ff6716e21e03983f8522b6e84f15f50a56e183085553e96d2801fc45dc3c74 AS dependencies

# The Label is used to write metadata
# So in this case it will cointain information about who wrote this 
LABEL maintainer="Gustavo Tavares <gmartinez-de-oliveir@myseneca.ca>"
LABEL description="Fragments node.js microservice"


# Env  is used to define environment variables
# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# WORKDIR set the working directory
# Use /app as our working directory
WORKDIR /app

# As David wrote:
# We use the COPY instruction to copy files and folders into our image. 
# In its most basic form, we use COPY <src> <dest>. This copies from the build context (i.e. our <src>) to a path inside the image (i.e., our <dest>).

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# RUN insrtuction will execute a command and cache this layer.
# Install node dependencies defined in package-lock.json
# npm ci install the exact versions from package-lock
RUN npm ci --only=production

#####################################################################


FROM node:16.13.2-apline3.14@sha256:d5ff6716e21e03983f8522b6e84f15f50a56e183085553e96d2801fc45dc3c74 AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=dependencies /app /app

# Copy the server
# Copy src to /app/src/
COPY ./src /app/src

# For baisc Auth
# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd


########################################################################


FROM node:16.13.2-apline3.14@sha256:d5ff6716e21e03983f8522b6e84f15f50a56e183085553e96d2801fc45dc3c74 AS deploy


WORKDIR /app

COPY --from=production /app /app

# Start the container by running our server
CMD ["npm", "start"]


# The EXPOSE instruction is mostly for documentation
# We run our service on port 8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3  \
CMD wget --no-verbose --tries=1 --spider localhost:80 || exit 1
