class CreateBrews < ActiveRecord::Migration[6.0]
  def change
    create_table :brews do |t|
      t.string :blend_name
      t.string :origin
      t.string :notes
      t.integer :strength

      t.timestamps
    end
  end
end
