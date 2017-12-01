namespace :data do

  desc 'Upgrade data json fields to DataAssociations'

  task :upgrade => :environment do 
    Sample.includes(:items).all.each do |s| 
      puts "Sample #{s.id}: Upgrading #{s.items.length} items."
      s.items.each do |i|
        i.upgrade true
      end
    end
  end

  task :downgrade => :environment do
    puts "Deleting #{DataAssociation.count} data associations"
    DataAssociation.destroy_all
  end


  task :upgrade_items_carefully => :environment do

    Item.all.each do |item|

      if item.id % 10000 == 0
        puts "Item #{item.id} ==========================================="
      end
    
      begin

        if item.data && item.data != ""
          obj = JSON.parse item.data.gsub(/\b0*(\d+)/, '\1').gsub("'", "\""), symbolize_names: true
        else
          obj = {}
        end

        obj.each do |k,v|

          if v != nil && k != :matrix and !item.get k
            puts "Item #{item.id} #{k} => #{v}"
            item.associate k, v
          end

        end

      rescue Exception => e

        puts "Could not parse data for item #{item.id}: #{e.to_s}"

      end

    end

  end

end