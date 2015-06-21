require 'bundler'
require 'sinatra/json'
require 'sinatra/reloader'

Bundler.require

set :bind, '0.0.0.0'
set :port, 3000

before do
  Docker.url = ENV['DOCKER_HOST']
end

get '/api' do
  containers = Docker::Container.all(all: 1)
  json containers.map! { |container| Docker::Container.get(container.id).info }
end

get '/' do
  File.read(File.join('public', 'index.html'))
end
