FROM bitnami/ruby

ADD server /app
ADD frontend/dist /app/public

RUN bundle install

CMD ["ruby", "api.rb"]
